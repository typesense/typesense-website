# Personalizing Search Results

Personalization, in the context of building search experiences, 
refers to the process of ranking search results differently for searchers based on unique characteristics we might know about them.

Personalization mechanisms come in two flavors:

1. **User-level personalization** - where results are ranked uniquely for each specific user depending on their specific past behavior (past searches, past purchases, past clicks, etc).
2. **User-group level personalization** - where results are ranked uniquely for each _group_ of users, depending on that group's aggregated characteristics (subscription plan they're on, user role, high LTV customers, etc) and/or past behaviors common to users in that group.

Typesense currently does not have an out-of-the-box personalization feature. 
However, it can be implemented on top of Typesense's [popularity-based ranking](./ranking-and-relevance.md#ranking-based-on-relevance-and-popularity) feature or <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search</RouterLink> feature.   

## A simple approach

Let's first see how we can implement **user-group level personalization** using a simple popularity-based ranking mechanism.

Let's use an example of a hardware tools e-commerce store, where users can pay to join one of three paid subscription plans: 
1. Hobbyist plan
2. Advanced plan
3. Professional plan

Let's say we want to show users a different set of products when they search for common terms, depending on the plan they are on.

For eg, if a user on the Hobbyist plan searches for the term "screwdriver", we want to show them small screwdriver sets suitable for Hobbyists. 
But if a user on the Professional plan searches for the same term "screwdriver", we want to show them heavy-duty professional grade power screwdriver sets suitable for Professionals.

Here's how we would implement this with Typesense. 

Let's say we have the following two product records:

```json
[
  {
    "name": "3-piece Screwdriver Set",
    "price": 10.0,
    "category": "Tools"
  },
  {
    "name": "120-piece Power Screwdriver Set",
    "price": 250.0,
    "category": "Tools"
  }
]
```

We can add plan-specific popularity scores to each record based on heuristics, or any other information we might already know about each group like the following:

```json{6-8,14-16}
[
  {
    "name": "3-piece Screwdriver Set",
    "price": 10.0,
    "category": "Tools",
    "hobbyist_plan_popularity_score": 100,
    "advanced_plan_popularity_score": 50,
    "professional_plan_popularity_score": 10
  },
  {
    "name": "120-piece Power Screwdriver Set",
    "price": 250.0,
    "category": "Tools",
    "hobbyist_plan_popularity_score": 10,
    "advanced_plan_popularity_score": 50,
    "professional_plan_popularity_score": 100    
  }
]
```

You can calculate these popularity scores using any business logic you might have, or using an ML model. 

Now let's say a user in the Hobbyist Plan logs in, in order to show them results personalized to their user group, we would add this `sort_by` parameter to the search query:

```
sort_by=_text_match(buckets: 10):desc,hobbyist_plan_popularity_score:desc
```

This would cause Typesense to [interweave text relevance with popularity score](./ranking-and-relevance.md#ranking-based-on-relevance-and-popularity) for that user's plan (Hobbyist) and show the "3-piece Screwdriver Set" first.

Similarly, if a user in the Professional Plan logs in, we would add this `sort_by` parameter to the search query:

```
sort_by=_text_match(buckets: 10):desc,professional_plan_popularity_score:desc
```

This would cause Typesense to [interweave text relevance with popularity score](./ranking-and-relevance.md#ranking-based-on-relevance-and-popularity) for that user's plan (Professional) and show the "120-piece Power Screwdriver Set" first.

### Use-cases

You could use this concept to show personalized results to different users based on:

- Customer Life-Time Value buckets (high, medium, low spenders)
- Tenure of their account (accounts older than 5 years, 2 years and new accounts)
- Age group (if you've collected this information already)
- Gender (for eg, you could rank products relevant to women higher if the user has indicated that they are female).
- Geographic location (for eg, you could rank products differently for your customers in the US vs Europe).

## Advanced Personalization

Typesense's <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html`">Vector Search</RouterLink> feature allows you to bring <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#what-is-an-embedding`">embeddings</RouterLink> from an ML model, 
index them in Typesense and then do a nearest-neighbor search. 

Using this core feature, if you build / use an ML model that takes into account a user's profile attributes, their browsing activity on your site / app, their past purchases, etc along with attributes of your records that you're indexing in Typesense, you could then generate embeddings from this model and send them to Typesense.

Then when a user logs in, you would generate a similar embedding once again from their profile data and search term, send it to Typesense via a `vector_query` to fetch all records that are "nearest" and render those as personalized results to this user.