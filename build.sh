#!/usr/bin/env sh

set -ex
PROJECT_DIR=`dirname $0 | while read a; do cd $a && pwd && break; done`

echo "Cleaning build directory and recreating it..."
rm -rf $PROJECT_DIR/build
cp -r $PROJECT_DIR/web $PROJECT_DIR/build

echo "Generating documentation..."
(cd $PROJECT_DIR/docs && bundle exec middleman build --clean)
mv $PROJECT_DIR/docs/build $PROJECT_DIR/build/docs

echo "Done!"