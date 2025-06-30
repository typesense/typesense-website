# Typesense Documentation

This directory contains Typesense's documentation site.

It uses [vuepress](https://vuepress.vuejs.org/) as a Static Site Generator.

On deployment, the dist folder generated is copied to [https://typesense.org/docs](https://typesense.org/docs).

## Content Authoring & Development Workflow

1. Navigate to `typesense-website/docs-site/`

2. Run `yarn`
3. Run `yarn dev`
4. Visit the link shown

As you write content in the content folder, the page should live reload.

### Adding images

Place images in [content/.vuepress/public/images](content/.vuepress/public/images). Prefer using SVGs.

Reference images in markdown files like this:

```
![Typesense DynamoDB Integration Chart](~@images/typesense-dynamodb.svg)
```

where `typesense-dynamodb.svg` is located at `./content/.vuepress/public/images/typesense-dynamodb.svg`

### Template Variables

These variables can be used in markdown files as `{{ variableName }}` or in Vue components.

| Variable                            | Definition                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| $page.typesenseVersion              | The current Typesense version that the user is looking at docs for. Will be `null` for non-versioned top level files. |
| $site.themeConfig.typesenseVersions | List of all Typesense versions                                                                                        |

**Note:** These variables [don't work](https://github.com/vuejs/vuepress/issues/2379) in auto-generated anchor tags and page titles.
To partially fix the issue with page titles, we have a workaround in `plugins/typesense-enhancements` to manually look for `{{ $page.typesenseVersion }}` in page titles and replace them.

### Authoring a new version

1. Add version number to `../typesenseVersions.json`
1. Clone the latest version directory and make edits to it.
1. Update sitemap priority for old version:
   ```bash
   find content/<old.version.number> -type f -name "*.md" -exec gsed -i 's/  priority: 0.7/  priority: 0.3/' {} +
   ```
1. Deploy both main site and docs site (since the main site has references to the latest version)

## Layout

- We override a few components from the default theme, by placing them in `content/.vuepress/theme/components/`
- Custom components go in `content/.vuepress/components/` and can be referenced in any markdown files
- Vuepress configuration goes in `content/.vuepress/config.js`

## Content Guidelines

- In the main version changelog, always use links to internal docs pages, instead of links to PR, so it's easy for users to navigate to the docs for a particular feature.
- In code blocks, use the following syntax to highlight relevant lines of the snippet, so it's easy for users to read the snippet. For eg: `json{2-3,5}` highlights lines 2 and 3 and 5.

## Deployment

```shell
yarn deploy
```
