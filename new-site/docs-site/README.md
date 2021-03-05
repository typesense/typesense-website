# Typesense Documentation

This directory contains Typesense's documentation site.

It uses [vuepress](https://vuepress.vuejs.org/) as a Static Site Generator.

On deployment, the dist folder generated is copied to [https://typesense.org/docs](https://typesense.org/docs).

## Content Authoring & Development Workflow

1. Navigate to project root
2. Run `yarn`
3. Run `yarn dev`
4. Visit the link shown

As you write content in the content folder, the page should live reload.

### Template Variables

These variables can be used in markdown files as `{{ variableName }}` or in Vue components.

| Variable | Definition |
|----------|------------|
| $page.typesenseVersion | The current Typesense version that the user is looking at docs for. Will be `null` for non-versioned top level files. |
| $site.themeConfig.typesenseVersions | List of all Typesense versions |

## To write documentation for a new version:

1. Add version number to `../typesenseVersions.js`
1. Clone the latest version directory and make edits to it.
1. Deploy both main site and docs site

## Layout

- We override a few components from the default theme, by placing them in `content/.vuepress/theme/components/`
- Custom components go in `content/.vuepress/components/` and can be referenced in any markdown files
- Vuepress configuration goes in `content/.vuepress/config.js`

## Deployment

```shell
yarn deploy
```
