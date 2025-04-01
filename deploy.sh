#!/bin/bash

set -ex

cd docs-site
yarn deploy

cd ../typesense.org-v3
npm run deploy
