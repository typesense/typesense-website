---
sidebarDepth: 2
---

# Typesense JS Client Tuning

If you are using the [Typesense JavaScript client](https://github.com/typesense/typesense-js)
in the browser, you usually want to be conservative with timeouts and retries. A search UI
should fail quickly on bad networks, not sit there for a long time retrying the same request.

## Browser Side

`connectionTimeoutSeconds` and `timeoutSeconds` limit how long the client will wait for a request.
`numRetries` and `retryIntervalSeconds` control how often the client tries again after a failure.
For a browser search experience, shorter values are usually better than long ones.

Client-side caching is handled by `cacheSearchResultsForSeconds`, which exists in the JS client.
That cache only helps inside the current browser session, so it is useful when users repeat the
same search or toggle between the same filters. It does not reduce load across different users.

`healthcheckIntervalSeconds` matters mostly when you have multiple nodes. It helps the client notice
that a node is unhealthy and move away from it. If you only have one node, it is usually not the
setting to focus on first.

## Server Side

If your goal is to reduce server load, the more important setting is `useServerSideSearchCache: true`.
That makes the client send `use_cache=true` to Typesense, which is described in the
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#caching-parameters`">Search API caching parameters</RouterLink>.
Server-side caching is what helps avoid recomputing the same search result again and again across
requests. If your data only changes every 12 hours, a `cache_ttl` of 30 minutes or even 1 hour is
often reasonable, as long as a small amount of staleness is acceptable. The server-side pieces that matter for search caching are outlined in
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/search.html#caching-parameters`">the caching section</RouterLink> of the Search API reference.

If requests are slow in general, the cause may be inside Typesense or outside it. A query can get
slow because it is expensive to evaluate, because the server is under load, because the network is
bad, or because Typesense is waiting on an external service.

To diagnose that side of the problem, turn on search logging and slow request logging, then look in
the log directory you configured with `log-dir`. Slow searches are typically written to
`/var/log/typesense/typesense.log` when you use the example configuration below:

```ini
log-dir = /var/log/typesense
enable-search-logging = true
enable-access-logging = true
log-slow-requests-time-ms = 2000
```

If you want to narrow the issue further, check whether the request is doing something expensive,
such as heavy faceting, large result windows, complex filters, or hybrid search with remote
embedding parameters. Typesense also exposes
<RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/vector-search.html#remote-embedding-api-parameters`">remote embedding timeout settings</RouterLink>
on the search request itself, which are the main server-side knobs for remote embedding latency.

For most browser-based search apps, a sensible starting point is short timeouts, a small retry
budget, and server-side caching turned on. Increase the numbers only when you have a clear reason to
prefer waiting over failing fast.
