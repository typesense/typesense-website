#!/bin/bash

set -ex

rm -rf ./dist

cd typesense.org
yarn install
yarn generate
mv dist ../dist

cd ../docs-site
yarn install
yarn build
rm -r ../dist/docs
mv content/.vuepress/dist ../dist/docs
