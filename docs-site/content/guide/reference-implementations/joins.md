# Using JOINs with Typesense and Django

This site showcases how to use Typesense JOINs with Django on a Formula 1 race dataset, using custom React components for [react-instantsearch](https://www.npmjs.com/package/react-instantsearch) with [typesense-instantsearch-adapter](https://www.npmjs.com/package/typesense-instantsearch-adapter).

[Source Code](https://github.com/typesense/showcase-joins-django)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/results/views.py#L35-L77) how to validate sorting parameters on the Python server. 
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/results/views.py#L15-L32) how to validate query parameters on the Python server.
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/common/util/typesense_utils.py#L5-L34) how to map Django model objects to Typesense documents.
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/results/management/commands/index_typesense.py#L13-L44) how to bulk import data from the Django ORM to Typesense.
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/results/apps.py#L74-L78) how to reference a collection's `id` in another collection.
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/frontend/src/routes/driver-details.tsx#L267) how to use a JOIN another collection in order to filter based on reference.
- [Here's](https://github.com/typesense/showcase-joins-django/blob/fba34cf198c758de4f9f799d339ae54f0102da4b/frontend/src/components/instantsearch/filter.tsx#L76-L239) how to build a custom Filter component for facets using [react-instantsearch's](https://www.npmjs.com/package/react-instantsearch) hooks.
