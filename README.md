# Typesense Website &amp; Documentation

If you notice any typographic or logical errors in our documentation, please open an issue or a pull request!

## Running Jekyll

```
$ cd typesense.org
$ bundle exec jekyll serve --livereload
```

You can now access the website on [`http://127.0.0.1:4000`](http://127.0.0.1:4000).

## Build

To create a Jekyll build:

```
$ sh build.sh
```

## Deployment

```
cd typesense.org && sh ../build.sh && aws s3 cp --recursive ../build/ s3://typesense.org --profile=typesense && aws cloudfront create-invalidation --distribution-id EQQQZ0LBFY66H --paths "/*" --profile typesense
```

&copy; 2016-2020 Typesense Inc.
