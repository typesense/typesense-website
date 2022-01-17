# Ranking and Relevance

Typesense ranks search results using a simple tie-breaking sorting algorithm that can rely on one or more of:

1. Text match score, exposed as a special ` _text_match` field.
2. User-defined indexed numerical fields (eg: popularity, rating, score, etc)
3. User-defined indexed string fields (eg: name) <Badge type="tip" text="v0.23.0.rc17" vertical="middle" />

## Text Match Score

The text match score is computed based on the following metrics:

1. **Frequency**: Number of tokens overlapping between the search query and a text field. Documents that have more overlapping tokens will be ranked above those with lesser overlapping tokens.
2. **Edit distance**: If a given token in the query is not found, we look at tokens that are within an edit distance of num_typos characters from the query tokens. Documents that contain the tokens in the query exactly are ranked higher than those containing tokens with larger edit distances.
3. **Proximity**: Whether the query tokens appear verbatim or interspersed with other tokens in the field. Documents in which the query tokens appear right next to each other will be ranked above documents where the query tokens exist but are far apart in a text field.
4. **Ordering of `query_by` fields**: A document that matches on a field earlier in the list of `query_by` fields is considered more relevant than a document matched on a field later in the list.
5. **Field weights specified in `query_by_weights` field**: A document that matches a field with a higher score is considered more relevant than a document that matches on a field with a lower score.

Based on the above metrics, Typesense calculates a `_text_match` score for ranking the documents on text relevance.

## Tie-Breaking-based Ranking

There might be cases when many documents contain the exact tokens in a search query. 
In such a case, their `_text_match` will also be the same. 
That's when the user-defined indexed numerical and string fields can be used to break the tie. 
You can specify up to two such user-defined fields to use for ranking.

For example, let's say that we're searching for books with a query like `short story`. 
If there are multiple books containing these exact words, then all those documents will have the same text match score.

To break the tie, we could specify up to two additional `sort_by` fields. 
For instance, we could say:

```
sort_by=_text_match:desc,average_rating:desc,publication_year:desc
```

This would sort the results in the following manner:

1. All matching records are sorted by their text match score.
2. If any two document share the same text match score, sort them by average rating.
3. If there is still a tie, sort them by their year of publication.

### Ranking based on Relevance and Popularity <Badge type="tip" text="v0.23.0.rc17" vertical="top" />

You can bucket results based on textual relevance and then sort within those buckets by a custom ranking/popularity score you've calculated on your end using the following:

```
sort_by=_text_match(buckets: 10):desc,weighted_score:desc
```

This will divide the result set into 10 buckets (with the first bucket containing the most relevant results) and force all results within each bucket to tie in `_text_match` score,
which will then cause those tied results to be sorted by your custom `weighted_score` field within each bucket.

### Ranking exact matches

By default, if the search query matches a particular field value verbatim, Typesense deems that document to have the highest relevancy and prioritizes it. 

However, there might be cases where this might not be desirable behavior. You can turn this off by setting `prioritize_exact_match=false` when [searching](../latest/api/documents.md#search-parameters).

### Default Ranking Order

When you don't provide a `sort_by` parameter to your search request, the documents will be ranked first on the _text_match score, then default sorting field values specified in the collection's schema, and if not specified the document insertion order:

```
sort_by=_text_match:desc,default_sorting_field:desc,document_insertion_order:desc
```

## Strict Ordering or Hard Sorting

If you wish to sort the documents strictly by an indexed numerical or string field like `price`, `name`, etc, you can just move the text match score criteria to the end as follows:

```
sort_by=price:desc,_text_match:desc
```

## Promoting or Hiding Results (Merchandising)

You can choose to pin (or hide) particular records by ID in particular ranking positions:

1. Based on a search query by setting up [Overrides (aka Curation)](../latest/api/curation.md) or
2. Dynamically using the [`pinned_hits` and `hidden_hits`](../latest/api/documents.md#search-parameters) search parameter

For eg: if someone searches for `phone`, you could setup an override to pin a particular product that has a good deal on it in position 1. 

Another common use-case for pinning results is merchandising in an ecommerce store, 
where a merchandiser (or your own custom ML model) might want to curate the exact products that should appear next to each other for a given product category.
Depending on the category page that the user is viewing, you can use the `pinned_hits` parameter to define which records should show up in which position for that page.

If you maintain the `Category Page -> pinned_hits` mapping in a CMS system, you can let your internal users modify it and have your application pull down this mapping when a particular category page is being rendered. 

## Tuning Typo Tolerance

Typesense handles typographical errors automatically for you out-of-the-box.
But there might be use cases where you might need to turn off typo tolerance or tweak its sensitivity (eg: part numbers, phone numbers)

To turn off typo tolerance completely, set `num_typos=0` and `typo_tokens_threshold=0` when [searching](../latest/api/documents.md#search-parameters).

You can also tweak typo tolerance sensitivity by setting those values to higher numbers as needed.
To control typo tolerance based on word length, you can use the `min_len_1typo` and `min_len_2typo` [search parameters](../latest/api/documents.md#search-parameters).

You can also adjust typo tolerance settings for individual fields by specifying multiple comma-separated values for `num_typos`. 
For eg: if you have `query_by=name,phone_number,zip_code` and you don't want typo tolerance on `phone_number` or `zip_code` you can set `num_typos=2,0,0`.

## Handling No Results

In some use-cases if all of the user's search terms don't match any of the documents, you might not want to show the user a "No results found" message.

In such cases, you can have Typesense automatically drop words / tokens from the user's search query, one at a time and repeat the search to show results that are close to the user's original query. 

This behavior is controlled by the `drop_tokens_threshold` search parameter, which has a default value of `1`. This means that if a search query only returns 1 or 0 results, Typesense will start dropping search keywords and repeat the search until at least 1 result is found.

To turn this behavior off, set `drop_tokens_threshold=0`
