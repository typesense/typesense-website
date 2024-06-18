# Address autocomplete

This demo shows you how to build an Address autocomplete experience using Typesense.

[Live Demo](https://address-autocomplete.typesense.org/) | [Source Code](https://github.com/typesense/showcase-address-autocomplete)

### Key Highlights

- [Here's](https://github.com/typesense/showcase-address-autocomplete/blob/master/README.md?plain=1#L34-L38) the Typesense schema for address autocomplete. Tip: it works best when we separate the address and zipcode into their own field and setting `query_by: adddress_without_zipcode, zipcode` in the [search params](https://github.com/typesense/showcase-address-autocomplete/blob/0587db57ca0eb4c39e7a4a44854e2daec046aca3/index.js#L23).
- [Here's](https://github.com/typesense/showcase-address-autocomplete/blob/0587db57ca0eb4c39e7a4a44854e2daec046aca3/index.js#L16) how to disable detached mode on smaller screen.
