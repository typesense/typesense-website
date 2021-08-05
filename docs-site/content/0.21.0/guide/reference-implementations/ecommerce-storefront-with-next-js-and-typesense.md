# E-Commerce Storefront with Next.js & Typesense

In addition to search experiences, Typesense can also be used to build performant browsing experiences like product listing pages in an ecommerce store.

This implementation specifically uses [Next.js](https://nextjs.org) for a frontend (React) framework.

[Live Demo](https://showcase-nextjs-typesense-ecommerce-store.vercel.app/) | [Source Code](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/pages/index.js#L22-L50) how to configure the [Typesense Instantsearch Adapter](https://github.com/typesense/typesense-instantsearch-adapter) with `react-instantsearch`.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/pages/index.js#L96-L106) how to configure the `RefinementList` widget to filter items.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/pages/index.js#L110-L115) how to configure the `ToggleRefinement` widget to filter boolean fields in records.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/master/components/RangeSlider/RangeSlider.js) a custom `RangeSlider` widget implementation.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/components/Hit/Hit.js#L21) how to highlight matched terms using the `Highlight` widget.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/pages/index.js#L163-L170) how to configure the `SortBy` widget to work with Typesense's support for multiple sort orders on the same index / collection.
- [Here's](https://github.com/typesense/showcase-nextjs-typesense-ecommerce-store/blob/0b5f6fd6f626844d0bac470d4633f20b83e9c99a/pages/index.js#L155-L162) how to allow your users to configure how many results they want to see per page. 
