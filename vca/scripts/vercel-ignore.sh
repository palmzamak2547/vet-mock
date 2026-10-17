#!/bin/sh
# Vercel's Ignored Build Step for the VCA project (vercel.json ignoreCommand, which Vercel caps at
# 256 characters). Exit 0 skips the build, anything else builds. Runs from vca/.
# Production only, as the main project: every preview is a billable build.
[ "$VERCEL_ENV" = production ] || exit 0
# The project's first build has nothing to compare against.
[ -n "$VERCEL_GIT_PREVIOUS_SHA" ] || exit 1
# Build when the site changed, or the bank and figures it reads from the main app. A git error
# (the previous deploy outside the shallow clone) builds instead of failing the deploy.
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- . ':!*.md' ../src/data ../src/lib/question-metadata.js \
  ../src/lib/option-shuffle.js ../src/lib/richtext.jsx ../public || exit 1
exit 0
