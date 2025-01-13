#!/bin/bash
echo 'Removing existing build...'
rm -rf build
echo 'Building new project...'
tsc --project .
echo 'Copying assets...'
node scripts/copy_assets.js
echo 'Initiate seeding...'
node build/databases/seed/index.js