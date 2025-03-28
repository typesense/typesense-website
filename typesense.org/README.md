# typesense.org

This directory contains the code to power [typesense.org](https://typesense.org).

We use [Nuxt.js](https://nuxtjs.org) in static (site generation) mode for a framework. 

This app specifically powers all routes, except `/docs` which is handled separately by the Vuepress site in [docs-site](docs-site).
We do this because Vuepress is specifically optimized (& opinionated) for documentation sites, whereas Nuxt is a generic and flexible Vue framework.
We need this flexibility for the non-documentation parts of typesense.org.

## Build Setup

```bash
yarn install
ln -s .env.development .env

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
yarn start

# generate static site
yarn generate
```

## Deployment

```bash
yarn deploy
```
