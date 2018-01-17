# Typesense Website &amp; Documentation

If you notice any typographic or logical errors in our documentation, please open an issue or a pull request!

## Website
 
The website is just static HTML. For development, you can start a SimpleHTTPServer:

```
$ cd web
$ python -m SimpleHTTPServer 6124
```

You can now access the website on [`http://localhost:6124`](http://localhost:6124).

## API Documentation

We use [Slate](https://github.com/lord/slate) for generating Typesense's API documentation. To run it locally:

```
$ cd docs
$ bundle install
$ bundle exec middleman server
```

You can now view the API documentation at `http://localhost:4567`.

## Build

To create a deploy build:

```
$ sh build.sh
```

&copy; 2016-2018 Wreally Studios Inc.