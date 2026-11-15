#!/usr/bin/env bash
# Run a command that needs apt on a GitHub runner, starting from an Ubuntu mirror that answers.
#
#   bash scripts/ci-apt-mirrors.sh <seconds> <command...>
#
# The runners list two mirrors of the same archive, and each has failed the release gate:
#   22 Oct 2026  azure.archive.ubuntu.com sent WebKit's libraries at 75 kB/s; every WebKit job hit its cap.
#   11 Nov 2026  the runners could not resolve any ubuntu.com name for hours (archive, azure and security
#                alike); Build and every e2e job failed at install.
# So nothing is trusted in advance. Each mirror is asked for the main package index first:
#   - a ubuntu.com mirror answers: it goes first, the other stays as apt's fallback (the runner's own list);
#   - neither answers: apt uses, for this job only, the mirrors outside ubuntu.com that do answer.
#     apt checks every index against Ubuntu's signing keys already on the runner, so such a mirror can be
#     slow or a few hours behind, but it cannot hand over a changed package.
# If the command still fails or overruns <seconds>, a leftover apt is stopped, the mirrors are asked again
# and the command runs once more (apt keeps what it already downloaded).
#
# tests/unit/ci-apt-mirrors.test.mjs drives the choice with APT_MIRRORS_FILE, APT_SUDO= and
# APT_MIRRORS_ALIVE, and fails when a release-gate workflow calls apt without this script.
set -u
limit="$1"; shift
file="${APT_MIRRORS_FILE:-/etc/apt/apt-mirrors.txt}"
sudo="${APT_SUDO-sudo}"
codename="$( (. /etc/os-release 2>/dev/null; echo "${VERSION_CODENAME:-noble}") )"
arch="$(dpkg --print-architecture 2>/dev/null || echo amd64)"
outside="https://mirrors.edge.kernel.org/ubuntu/ https://mirrors.mit.edu/ubuntu/"

# "://" keeps the plain archive from matching inside azure.archive.ubuntu.com.
archive="$(grep -oE 'https?://archive\.ubuntu\.com/ubuntu/?' "$file" 2>/dev/null | head -1)"
azure="$(grep -oE 'https?://azure\.archive\.ubuntu\.com/ubuntu/?' "$file" 2>/dev/null | head -1)"

answers() { # true when the mirror sends the main package index (about 1.8 MB) within 6 s
  if [ -n "${APT_MIRRORS_ALIVE+set}" ]; then
    case " $APT_MIRRORS_ALIVE " in *" $1 "*) return 0 ;; *) return 1 ;; esac
  fi
  # A file this size separates the failures seen: a name that does not resolve fails at once,
  # and 75 kB/s (22 Oct) would need 24 s. A small file would pass a crawling mirror.
  curl -fsSL --max-time 6 -o /dev/null "${1%/}/dists/$codename/main/binary-$arch/Packages.gz" 2>/dev/null
}

order=()    # the mirrors for this try, the first tried first
mode=own    # own: the runner's ubuntu.com mirrors; outside: mirrors under another name

pick() { # fills $order; false when the runner's list is one we do not recognise
  order=(); mode=own
  [ -n "$archive" ] && [ -n "$azure" ] || return 1
  local m
  if answers "$archive"; then order=("$archive" "$azure")
  elif answers "$azure"; then order=("$azure" "$archive")
  else
    for m in $outside; do answers "$m" && order+=("$m"); done
    if [ "${#order[@]}" -gt 0 ]; then mode=outside
    else order=("$archive" "$azure"); echo "::warning::no Ubuntu mirror answered the probe; trying anyway"
    fi
  fi
}

apply() { # writes $order into the list; the runner's other lines stay unless every ubuntu.com name is down
  local tmp priority=1 m
  tmp="$(mktemp)"
  [ "$mode" = own ] && grep -vE '://(azure\.)?archive\.ubuntu\.com/' "$file" > "$tmp"
  for m in "${order[@]}"; do printf '%s\tpriority:%s\n' "$m" "$priority" >> "$tmp"; priority=9; done
  $sudo cp "$tmp" "$file"
  rm -f "$tmp"
  [ "$mode" = outside ] && echo "::warning::no ubuntu.com mirror answers on this runner; for this job apt uses ${order[*]}"
  echo "apt starts from ${order[0]}"
}

if pick; then apply
else echo "apt mirror list left as it is: $file does not name both mirrors"   # one mirror, another architecture
fi
[ "${1:-}" = "--order-only" ] && exit 0

# A connection that stalls is dropped after 20 s, so apt moves to the fallback instead of waiting.
printf 'Acquire::Retries "2";\nAcquire::http::Timeout "20";\nAcquire::https::Timeout "20";\nDPkg::Lock::Timeout "60";\n' \
  | $sudo tee /etc/apt/apt.conf.d/99-ci-mirrors > /dev/null

timeout --kill-after=15 "$limit" "$@" && exit 0
code=$?
[ "${#order[@]}" -gt 0 ] || exit "$code"
echo "::warning::the command did not finish starting from ${order[0]} (exit $code); asking the mirrors again"
# The stopped command leaves its apt running as root with the lists locked (11 Nov: the second try died
# on that lock). Stop it, and let dpkg finish anything it was in the middle of.
$sudo pkill -TERM -x apt-get 2> /dev/null; sleep 3; $sudo pkill -KILL -x apt-get 2> /dev/null
$sudo dpkg --configure -a > /dev/null 2>&1 || true
previous="${order[0]}"
if pick; then
  # Whatever answered first last time did not carry the command through: let another go first if there is one.
  if [ "${order[0]}" = "$previous" ] && [ "${#order[@]}" -gt 1 ]; then order=("${order[@]:1}" "$previous"); fi
  apply
fi
timeout --kill-after=15 "$limit" "$@"
