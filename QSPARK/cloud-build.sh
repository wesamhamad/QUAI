#!/usr/bin/env bash
#
# Laravel Cloud build script for the Q SPARK demo application.
#
# This repository (wesamhamad/QUAI) is a monorepo:
#   - the repo ROOT is the QUAI app
#   - ./QSPARK is a SEPARATE Laravel app (the Q SPARK demo)
#
# Laravel Cloud does not have a native "deploy a subdirectory" setting, so the
# QSPARK application on Laravel Cloud must use this script as its
# "Build Commands". It runs after checkout: it promotes ./QSPARK to the deploy
# root, then runs the standard Laravel build.
#
# The QUAI application on Laravel Cloud needs NO custom build script — its code
# already lives at the repo root.
#
set -euo pipefail

echo "==> Promoting ./QSPARK to the deploy root"

# 1. Copy the QSPARK app out of the way.
mkdir -p /tmp/qspark_src
cp -Rf QSPARK/. /tmp/qspark_src/

# 2. Clear the deploy root of the QUAI app (keep .git and any injected .env).
find . -maxdepth 1 -mindepth 1 ! -name '.git' ! -name '.env' -exec rm -rf {} +

# 3. Move the QSPARK app into the deploy root.
cp -Rf /tmp/qspark_src/. .
rm -rf /tmp/qspark_src

echo "==> Building Q SPARK"

# 4. Standard Laravel build (the script fully replaces Cloud's default steps).
composer install --no-dev --optimize-autoloader --no-interaction
npm ci
npm run build
