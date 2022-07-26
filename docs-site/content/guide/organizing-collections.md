# Organizing Collections

In this article, we'll discuss different approaches to organize documents into one or more collections, and the tradeoffs to consider. 

## Hierarchy

In Typesense, a cluster can have one or more nodes and each node stores an exact replica of the entire dataset you send to the cluster.

A cluster can have one or more collections, and a collection can have many documents that share the same/similar structure (fields/attributes).

For eg, say you have CRM system that stores details of people and companies. 
To store this data in Typesense, you would create:

- a collection called `people` that stores individual documents containing information about people (eg: attributes like `name`, `title`, `company_name`, etc) 
- a collection called `companies` that stores individual documents containing information about companies (eg: attributes like `name`, `location`, `num_employees`, etc).

Here's a visual representation of this hierarchy:

```
[Typesense Cluster] ===has-many===> [Collections] ===has-many===> [Documents] ===has-many===> [Attributes/Fields]
```

:::tip Note

In Typesense Cloud, there is an additional level of hierarchy. 

A user can have multiple accounts (for eg, when you're part of multiple teams), and an account can have multiple clusters and the rest of the hierarchy is the same as above.

```
[User] ===has-many===> [Accounts] ===has-many===> [Typesense Clusters] ===has-many===> [Collections] ===has-many===> [Documents] ===has-many===> [Attributes/Fields]
```

:::

## Single vs Multiple Collections

In general, we recommend that you create one collection per type of document / record you have. 
It might help to think of a collection as being similar to a table in a relational database.

So for eg, if you have an ecommerce store, and you want users to search on products and blog articles, 
you would create two collections:

- `products` collection to store all product records
- `blog_articles` collection to store all blog article

Now, a particular product like a mobile phone might not have too many common attributes with another product like a refrigerator. 
It's still ok to place both of them in the same `products` collection.
You can set non-common fields/attributes as optional in the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/collections.html#with-pre-defined-schema`">collection schema</RouterLink>.

## Handling Dev / Staging / Prod Environments

You can use one of two approaches to handle data across application environments.

**Approach 1:** You can set up different clusters for each environment.
This gives you maximum flexibility and isolates the environments completely from each other.
This also makes it easy to test changes on new versions of Typesense on other environments before upgrading your production environment.
The tradeoff is that you now have to manage API keys and collections on multiple clusters for each env, and cost-wise you'll be paying for additional clusters.

**Approach 2:** You can use one cluster, but create separate suffixed collections.
For eg: `collectionx_production`, `collectionx_staging`, etc.
You can then create separate API keys for each environment and isolate access.
Now, if you mirror your entire production data in staging, this approach will get more expensive because if you have High Availability turned ON for your single cluster, you'll be paying for more RAM for both staging and production data.
Whereas with Approach 1, you can turn off HA on your staging cluster and save costs.
But if you only have a small subset of your data in staging, then Approach 2 would be more economical.

## Multi-tenant Applications

Let's say you have a social media app, and you want to restrict users to only search through their own friends' names. 

You can store all users in a single collection called say `users` in Typesense, along with an array attribute in each user document called say `friends_with_user_ids`.
You can then generate individual <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/keys.html#generate-scoped-search-key`">Scoped Search API Keys</RouterLink> for each user and restrict that key to only be able to access records that have this user's ID in the `friends_with_user_ids` attribute.

Effectively, each user can only search / access their own data within the larger collection that stores all user records. 

## Sharding Collections

Typesense has been tested and used with 100s of millions of documents per collection (so far, as reported by users). 

However, as the number of documents in a collection increases and/or the complexity of filtering increases, search response times tend to be correlated with the size of the collection.
This is very similar to how the size of tables in a relational database affect query processing times at scale.

If you happen to notice any write / read performance issues at scale in Typesense, 
a good way to improve performance is by sharding the single collection into multiple collections using an attribute like `user_id`, `created_at`, `country`, etc. 
So for eg, you could create collections like `users_usa`, `users_canada`, `users_uk` and place users in each of those countries in separate collections.
Or you could create collections like `users_1`, `users_2`, ... `users_n` and place all users with user_id of `user_id mod n` in the respective collection.   

Another use case is in a [multi-tenant application](#multi-tenant-applications) - if there is one particular user whose data is sufficiently large,
you could move just that user's data into a new collection, while leaving all other users' data in the main collection.


## Single vs Multiple Clusters

There are a couple of scenarios were multiple clusters could be beneficial:

**Multiple Environments**: Read more [above](#handling-dev--staging--prod-environments)

**Multi-tenant Applications**: In a [multi-tenant environment](#multi-tenant-applications), 
you could a particular user's data into a completely separate / independent Typesense cluster 
for performance reasons or compliance reasons or both as needed. 

**Based on Use-Case**: Let's say you have an application that has multiple search experiences: 
one for users to search through products, one for users to search through their past orders, 
another for users to search through help articles, another for support agents to lookup users. 
Say you don't want infrastructure issues to bring down search across your entire site and internal tools. 
In this use-case, you could spin up one cluster for each of the use-cases above (one cluster for product search, another for order history search, etc). 
The other advantage besides independent failure boundaries is that you can scale each cluster independently as needed.
For eg, may be product search receives more traffic than order history search and you could power the former with higher capacity hardware.