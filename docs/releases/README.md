# Release records

One file per release, `docs/releases/<version>.md`, written in the pull request that ships it:
what the release changes, the checks run on the final tree (with numbers), the CI run on the
exact SHA, the Vercel deployment and the live flow checked on vetmock.com. The same proof chain
LAUNCH_READINESS.md asked for; a file each so two releases never conflict. Releases from before pipeline v2
are in [../LAUNCH_READINESS.md](../LAUNCH_READINESS.md).
