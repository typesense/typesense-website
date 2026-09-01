#!/bin/bash

set -ex

cd docs-site
bun run deploy

cd ../typesense.org-v3
npm run deploy
