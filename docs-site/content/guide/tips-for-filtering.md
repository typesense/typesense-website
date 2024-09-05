# Tips for Filtering Data in Typesense

In this article, we'll talk about how to filter data in Typesense using various filtering options:

[[toc]]

## Basic Filtering

Typesense allows you to filter your search results based on the values of specific fields. You can
use the `filter_by` parameter to specify a custom filter string.

```json
{
  "q": "*",
  "filter_by": "country:=USA"
  // ...
}
```

Note that the base format for a filter is `field: <operator> <value>`. Every filter field must have
a `:` after it.

- :white_check_mark: Correct: `price:>=100`
- :x: Incorrect: `price>=100`

## Available Operators
| Operator | Description | Example |
|----------|-------------|---------|
| `=`      | Equal to    | `country:=USA` |
| `>`      | Greater than| `price:>100` |
| `<`      | Less than   | `price:<100` |
| `!=`     | Not equal to| `status:!=inactive` |
| `<=`     | Less than or equal to | `price:<=100` |
| `>=`     | Greater than or equal to | `price:>=100` |
| `=[]`    | one of | `country:=[USA, UK, Canada]` |
| `!=[]`   | not one of | `country:!=[USA, UK, Canada]` |
| `[..]`   | Range | `price:[100..200]` |

## Boolean operations

You can combine multiple filters using boolean operators.

| Operator | Description | Example |
|----------|-------------|---------|
| `&&`     | AND | `country:=USA && city:=New York` |
| `\|\|`   | OR  | `country:=USA \|\| country:=Canada` |
| `!`      | NOT | `!country:=USA` |

When using boolean operators, you can use parentheses to group your filters.


For example, to filter for products that are either made in the USA or Canada, and are located in New York, you can use the following filter:

`(country:=USA || country:=Canada) && city:=New York`

This will return products that are either made in the USA or Canada, and are located in New York.

## Filtering Joined Collections

When filtering for joined collection, you use the `$TableName(<filter>)` syntax.

For example, if you have a `products` collection with a `category` field and a `categories` collection with a `name` field, you can filter for products that are in the `Electronics` category like this:

`$categories(name:=Electronics)`

Inside of the joined collection, you can use any filter string that you would use directly for that
collection, including `&&`, `||` and `!` boolean operators. For example, to filter on products in
the Electronics category AND the `Mobile Phones` category, but NOT in the `Disposable` category, and
under $100, you can use the following filter:

`$categories(name:=Electronics && name:=Mobile Phones && name:=!Disposable) && price:<100`

**IMPORTANT** Joins must be configured in the schema prior to using them in a filter.

See <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/joins.html`">JOINs</RouterLink> for more details.
