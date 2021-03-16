#!/bin/bash

set -ex

cd docs-site
yarn deploy

cd ../typesense.org
yarn deploy
