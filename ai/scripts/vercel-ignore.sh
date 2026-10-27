#!/bin/sh
# Vercel's Ignored Build Step for the VetMock AI project (vercel.json ignoreCommand, capped at
# 256 characters). Exit 0 skips the build, anything else builds. Runs from ai/.
# Production only, as the main project: every preview is a billable build.
[ "$VERCEL_ENV" = production ] || exit 0
# The project's first build has nothing to compare against.
[ -n "$VERCEL_GIT_PREVIOUS_SHA" ] || exit 1
# A redeploy of the same commit is on purpose (an environment variable changed): build it.
[ "$VERCEL_GIT_PREVIOUS_SHA" = "$VERCEL_GIT_COMMIT_SHA" ] && exit 1
# Build when this app changed, or the shared brand files it serves from the main app's public/.
# A git error (the previous deploy outside the shallow clone) builds instead of failing.
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- . ':!*.md' ':!tests' ../public/vetmock-logo.svg \
  ../public/favicon.svg ../public/favicon-32.png ../public/favicon.ico ../public/icon-512.png \
  ../public/art/mochi-subjects/aquatic.webp || exit 1
exit 0
