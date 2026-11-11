#!/usr/bin/env bash
# Run a command that needs apt on a GitHub runner, starting from an Ubuntu mirror that answers.
#
#   bash scripts/ci-apt-mirrors.sh <seconds> <command...>
#
# The runners list two mirrors of the same archive, and each has failed the release gate once:
#   22 Oct 2026  azure.archive.ubuntu.com sent WebKit's libraries at 75 kB/s; every WebKit job hit its cap.
#   11 Nov 2026  archive.ubuntu.com stopped resolving; Build and every e2e job failed at install for an hour.
# So neither is trusted in advance. The release index is fetched from each; the first that answers at a
# usable speed goes first and the other stays as apt's fallback. If the command still fails or overruns
# <seconds>, the order is turned round and it runs once more (apt keeps what it already downloaded).
#
# tests/unit/ci-apt-mirrors.test.mjs drives the choice of order with APT_MIRRORS_FILE, APT_SUDO= and
# APT_MIRRORS_ALIVE, and fails when a release-gate workflow calls apt without this script.
set -u
limit="$1"; shift
file="${APT_MIRRORS_FILE:-/etc/apt/apt-mirrors.txt}"
sudo="${APT_SUDO-sudo}"
codename="$( (. /etc/os-release 2>/dev/null; echo "${VERSION_CODENAME:-noble}") )"
arch="$(dpkg --print-architecture 2>/dev/null || echo amd64)"

# "://" keeps the plain archive from matching inside azure.archive.ubuntu.com.
archive="$(grep -oE 'https?://archive\.ubuntu\.com/ubuntu/?' "$file" 2>/dev/null | head -1)"
azure="$(grep -oE 'https?://azure\.archive\.ubuntu\.com/ubuntu/?' "$file" 2>/dev/null | head -1)"

answers() { # true when the mirror sends the main package index (about 1.8 MB) within 6 s
  if [ -n "${APT_MIRRORS_ALIVE+set}" ]; then
    case " $APT_MIRRORS_ALIVE " in *" $1 "*) return 0 ;; *) return 1 ;; esac
  fi
  # A file this size separates the two failures seen: a name that does not resolve fails at once,
  # and 75 kB/s (22 Oct) would need 24 s. A small file would pass a crawling mirror.
  curl -fsSL --max-time 6 -o /dev/null "${1%/}/dists/$codename/main/binary-$arch/Packages.gz" 2>/dev/null
}

start_from() { # $1 goes first, $2 is the fallback; every other line of the list is kept as it is
  local tmp
  tmp="$(mktemp)"
  { grep -vE '://(azure\.)?archive\.ubuntu\.com/' "$file"; printf '%s\tpriority:1\n%s\tpriority:9\n' "$1" "$2"; } > "$tmp"
  $sudo cp "$tmp" "$file"
  rm -f "$tmp"
  echo "apt starts from $1, falls back to $2"
}

first=''; second=''
if [ -n "$archive" ] && [ -n "$azure" ]; then
  if answers "$archive"; then first="$archive"; second="$azure"
  elif answers "$azure"; then first="$azure"; second="$archive"
  else first="$archive"; second="$azure"; echo "::warning::neither Ubuntu mirror answered the probe; trying anyway"
  fi
  start_from "$first" "$second"
else
  # A list we do not recognise (one mirror, another architecture): leave it alone.
  echo "apt mirror list left as it is: $file does not name both mirrors"
fi
[ "${1:-}" = "--order-only" ] && exit 0

# A connection that stalls is dropped after 20 s, so apt moves to the fallback instead of waiting.
# The lock wait is for the second try below: an apt that was stopped may still be letting go.
printf 'Acquire::Retries "2";\nAcquire::http::Timeout "20";\nAcquire::https::Timeout "20";\nDPkg::Lock::Timeout "60";\n' \
  | $sudo tee /etc/apt/apt.conf.d/99-ci-mirrors > /dev/null

timeout "$limit" "$@" && exit 0
code=$?
[ -n "$first" ] || exit "$code"
echo "::warning::the command did not finish starting from $first (exit $code); once more from $second"
start_from "$second" "$first"
# If the first try was stopped while dpkg was unpacking, finish that before asking apt again.
$sudo dpkg --configure -a > /dev/null 2>&1 || true
timeout "$limit" "$@"
