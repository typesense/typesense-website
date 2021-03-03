#!/bin/bash

set -ex

./build.sh

aws s3 cp --recursive ./dist s3://new-site.typesense.org/ --profile typesense

aws cloudfront create-invalidation --distribution-id EJ8VOUOZDDMVB --paths "/*" --profile typesense
