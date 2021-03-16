# Ranking and Relevance

Typesense ranks search results using a simple tie-breaking algorithm that relies on two components:

1. String similarity.
2. User-defined `sort_by` numerical fields.

Typesense computes a string similarity score based on how much a search query overlaps with the fields of a given document. Typographic errors are also taken into account here. Let's see how.

When there is a typo in the query, or during prefix search, multiple tokens could match a given token in the query. For e.g. both “john” and “joan” are 1-typo away from “jofn”. Similarly, in the case of a prefix search, both “apple” and “apply” would match “app”. In such scenarios, Typesense would use the value of the `default_sorting_field` field to decide whether documents containing "john" or "joan" should be ranked first.

When multiple documents share the same string similarity score, user-defined numerical fields are used to break the tie. You can specify up to two such numerical fields.

For example, let's say that we're searching for books with a query like `short story`. If there are multiple books containing these exact words, then all those documents would have the same string similarity score.

To break the tie, we could specify up to two additional `sort_by` fields. For instance, we could say, `sort_by=average_rating:DESC,publication_year:DESC`. This would sort the results in the following manner:

1. All matching records are sorted by string similarity score.
2. If any two records share the same string similarity score, sort them by their average rating.
3. If there is still a tie, sort the records by year of publication.
