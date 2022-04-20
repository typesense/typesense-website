# Query Suggestions

When you start typing a search term into say Google or Amazon, 
you might have seen a drop-down showing you suggestions for queries to try:

<figure>
<img src="~@images/query-suggestions/query-suggestions-google.png" alt="Sarch Suggestions on Google" height="300">
<figcaption>Search Suggestions on Google</figcaption>
</figure>
<br>
<figure>
<img src="~@images/query-suggestions/query-suggestions-amazon.png" alt="arch Suggestions on Amazon" height="240">
<figcaption>Search Suggestions on Amazon</figcaption>
</figure>
<br>
<br>

In this article we will discuss how to implement Query Suggestions with Typesense.

## Do you need Query Suggestions? 

### Some Historical Context

Before query suggestions came to be popular, the typical search user experience was to have users type in a search query and press enter to see the results.
If they didn't see any results for their query, they would have to go back and repeat this process again.

**The problem:** Pressing the Enter key to run the search query each time adds just enough friction to users to prevent them from searching and exploring more of the underlying dataset.

**Ideal Solution:** Show users results right away as they type, instead of asking them to press enter. 

However, historically search engines have been relatively slow or computationally intensive to perform queries for every single key press against the _entire_ dataset.
So the ideal solution could not be implemented effectively at scale. 

So to mitigate this, the idea of Query Suggestions was born: 
you index a subset of the most popular search terms (not the full records), and run searches against this smaller dataset to show query suggestions on each key press, ask users to select one of the suggestions and then still have them press "Enter" to do a search against the full dataset.

## Modern Search Experiences

With an instant-search engine like Typesense where the entire search index is held in memory,
it is now possible to search the entire dataset and show results to users from your primary dataset right away without them having to press enter at any point, 
instead of having to resort to a workaround which came to be due to [historical reasons](#some-historical-context). 

For example, here's a search-as-you-type experience that shows this user experience.
Notice how instead of showing suggestions in one step and then full results in another page, it directly shows users the full results in less than 50ms for most queries, even with 32 Million records: 

<div style="text-align: center; margin: 3em;">
  <video width="640" muted controls preload="none" poster="~@images/query-suggestions/search-as-you-type-poster.png">
      <source src="~@images/query-suggestions/search-as-you-type.mp4"
              type="video/mp4">
  
      Sorry, your browser doesn't support embedded videos.
  </video>
</div>
<script>
// https://stackoverflow.com/a/28729753/123545
document.getElementsByTagName('video')[0].onended = function () {
  this.load();
  this.play();
};
</script>

Here's a link to the live experience: [songs-search.typesense.org](https://songs-search.typesense.org/)

Here's another site that uses Typesense to power their federated search-as-you-type experience: [www.echidnasewing.com.au](https://www.echidnasewing.com.au/). (Try searching for "wool").

## Search Suggestions with Typesense

While we recommend building search as you type experiences without an intermediate query suggestion step (see above for why), 
if you still have a requirement to implement query suggestions, you can still do this with Typesense. 

You can send the search queries to your primary dataset, but when displaying the results in the UI, you can pick one field from your document to show users in a dropdown format.
So this would primarily be a UI treatment, and you wouldn't have to do anything specific for query suggestions.

If your site has sufficient search traffic, you could also collect the search terms that users are typing into your search box from your frontend, 
aggregate them in your backend, add them to a new `popular_queries` collection in Typesense, along with a popularity score for every search term
and then send query suggestion searches to this collection in addition to your primary collection in a `multi_search` query.
This way you can show search query suggestions and full results side-by-side giving users more ways to explore your data.