---
sitemap:
  priority: 0.7
---

# Ranking and Relevance

Typesense ranks search results using a simple tie-breaking sorting algorithm that can rely on one or more of:

1. Text match score, exposed as a special ` _text_match` field.
2. User-defined indexed numerical fields.

## Text match score
The text match score is computed based on the following metrics:

1. **Frequency**: Number of tokens overlapping between the search query and a text field. Documents that have more overlapping tokens will be ranked above those with lesser overlapping tokens.
2. **Edit distance**: If a given token in the query is not found, we look at tokens that are within an edit distance of num_typos characters from the query tokens. Documents that contain the tokens in the query exactly are ranked higher than those containing tokens with larger edit distances.
3. **Proximity**: Whether the query tokens appear verbatim or interspersed with other tokens in the field. Documents in which the query tokens appear right next to each other will be ranked above documents where the query tokens exist but are far apart in a text field.
4. **Ordering of `query_by` fields**: A document that matches on a field earlier in the list of `query_by` fields is considered more relevant than a document matched on a field later in the list.

Based on the above metrics, Typesense calculates a `_text_match` score for ranking the documents on text relevance.

However, there will be cases when many documents contain the exact tokens in a search query. In such a case, their `_text_match` will also be the same. That's when user-defined indexed numerical fields can be used to break the tie. You can specify up to two such numerical fields.

For example, let's say that we're searching for books with a query like `short story`. If there are multiple books containing these exact words, then all those documents would have the same text match score.

To break the tie, we could specify up to two additional `sort_by` fields. For instance, we could say:

`sort_by=_text_match:desc,average_rating:desc,publication_year:desc`

This would sort the results in the following manner:

1. All matching records are sorted by their text match score.
2. If any two document share the same text match score, sort them by average rating.
3. If there is still a tie, sort them by their year of publication.
<br>

## Default ranking order
When you don't provide a `sort_by` parameter to your search request, the documents will be ranked on the text match score and default sorting field values:

`sort_by=_text_match:desc,default_sorting_field:desc`

## Strict ordering on numerical field
If you wish to sort the documents strictly by an indexed numerical field like `price`, you can just move the text match score criteria after the `price` field as follows:

`sort_by=price:desc,_text_match:desc`
