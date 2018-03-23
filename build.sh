#!/usr/bin/env sh

set -ex
PROJECT_DIR=`dirname $0 | while read a; do cd $a && pwd && break; done`

echo "Generating Jekyll static build..."

rm -rf $PROJECT_DIR/typesense.org/_site
(cd $PROJECT_DIR/typesense.org && jekyll build)
mv $PROJECT_DIR/typesense.org/_site $PROJECT_DIR/build

echo "Done!"