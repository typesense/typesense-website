# Using Search with Kotlin Compose and Typesense

This site showcases how to use Typesense with Kotlin Compose to search through a soccer match dataset, implementing custom UI components and leveraging Typesense for fast, faceted search functionality.

[Source Code](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose)

### Key Highlights

- [Here's](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose/blob/main/app/src/main/java/com/example/showcase_soccer_matches_search_kotlin_compose/utils/typesense.kt) how to set up the Typesense client in Kotlin.
- [Here's](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose/blob/main/app/src/main/java/com/example/showcase_soccer_matches_search_kotlin_compose/viewmodels/MatchesViewModel.kt#L133-L159) how to use Typesense in a `ViewModel` to fetch and filter soccer matches.
- [Here's](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose/blob/main/app/src/main/java/com/example/showcase_soccer_matches_search_kotlin_compose/components/SearchBar.kt) how to implement a search bar with real-time filtering using Typesense.
- [Here's](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose/blob/main/app/src/main/java/com/example/showcase_soccer_matches_search_kotlin_compose/components/MyDrawer.kt) how to create a custom facet filter UI to refine search results.
- [Here's](https://github.com/DATAGNIKAN/showcase-soccer-matches-search-kotlin-compose/blob/main/app/src/main/java/com/example/showcase_soccer_matches_search_kotlin_compose/components/MatchesList.kt) how to display the filtered list of soccer matches using infinite scroll in Compose.