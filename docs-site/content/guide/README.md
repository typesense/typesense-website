---
title: "Get Started with Typesense: Quickstart and Tutorials"
description: "Start with Typesense in one of three ways. Give a prompt to an AI agent, scaffold a search app with create-typesense-app, or follow the guides step by step."
sidebarDepth: 1
---

# Get started with Typesense

You can run your first Typesense search in one of three ways. Give a prompt to an AI agent, scaffold a search app with one command, or follow the guides step by step.

To find out what Typesense is and what you can build with it, read the [Overview](../overview/what-is-typesense.md). For every endpoint and parameter, see the <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/`">API reference</RouterLink>.

## Use an AI agent

Copy this prompt into Claude Code, Codex, Cursor, or any other coding agent. The agent starts a local Typesense server, imports a sample dataset of books, and builds a search page in one `index.html` file.

```markdown
Build me a local Typesense search demo:

1. Start Typesense {{ $site.themeConfig.typesenseLatestVersion }} with Docker
   (image typesense/typesense:{{ $site.themeConfig.typesenseLatestVersion }}). If Docker isn't available,
   use the Typesense binary for this computer from the install docs
   instead, without sudo. If neither works on this computer, stop and
   tell me. Make the server reachable only from this computer, allow
   browser requests (CORS), keep the data in ./typesense-data, and use
   the API key `xyz` (for this local demo only).
2. Download the sample dataset from
   https://dl.typesense.org/datasets/books.jsonl.gz, create a `books`
   collection for it, and import it.
3. Create a search-only API key. Build a single index.html that uses
   InstantSearch.js with typesense-instantsearch-adapter to search the
   books, with a search box, results with cover images, and an author
   filter.
4. Search for "hary potr" to check that Harry Potter books come back.
   Check that every CDN link in index.html loads. Then tell me how to
   open the page and how to stop the server.

Use the Typesense docs, not memory. Start at
https://typesense.org/docs/llms.txt. If I already have Typesense
running, don't change it or its data.
```

:::tip Want to try Typesense Cloud instead?
Connect your agent to the [Typesense Cloud MCP server](./typesense-cloud/mcp-server.md). The agent can then create a [Typesense Cloud](https://cloud.typesense.org/) cluster, index your data, and run searches. You choose what the agent can do when you connect it, and the agent never receives your cluster's admin key.
:::

## Scaffold your first Typesense app

`create-typesense-app` starts Typesense in Docker, imports about 10,000 sample books, and creates a Next.js app with a search UI. These commands create the app and start it:

```bash
npx --yes create-typesense-app@latest my-search-app --yes
cd my-search-app
npm run dev
```

The command needs Node.js 22 or newer and Docker. Start Docker before you run it.

To pick another framework, or to connect to a Typesense server or Typesense Cloud cluster that you already run, remove the last `--yes`. The command then asks you for each option. The other frameworks are Qwik, Solid, and vanilla JavaScript.

## Do it by hand {#quick-start}

To run each step yourself and see how each part works, follow these guides in order:

1. Read [Typesense Use Cases](../overview/use-cases.md) to see what you can build beyond full-text search. Then try the [Live Demos](../overview/demos.md).
2. [Install Typesense](./install-typesense.md).
3. [Install a client library](./installing-a-client.md).
4. [Build a search application](./building-a-search-application.md).
5. [Build a search UI](./search-ui-components.md).
6. Before you go live, read [Running Typesense in Production](./running-in-production.md).

If you use Algolia today, follow [Migrating from Algolia](./migrating-from-algolia.md). To add search to a documentation site, follow [DocSearch for Documentation Sites](./docsearch.md).

The sidebar lists every other guide.

## Get help {#getting-help}

If the docs don't answer your question, use one of these:

- Read the [Frequently Asked Questions](/guide/faqs.md).
- Search [past GitHub issues](https://github.com/search?q=org%3Atypesense++issues&type=issues) across all Typesense repositories.
- Search [past conversations](https://threads.typesense.org/) from the Slack community.
- Ask a question or report a bug in a [GitHub issue](https://github.com/typesense/typesense/issues).
- Join the [Slack community](https://typesense.link/slack-community) to talk with other Typesense users.
- To schedule a call with the core Typesense team, [sponsor Typesense on GitHub](https://github.com/sponsors/typesense?frequency=one-time) at a one-time tier. Then email contact at typesense dot org.
- Get paid support with guaranteed SLAs over private Slack, email, and phone. See [Typesense Cloud support plans](https://cloud.typesense.org/support-plans).

---

<br>

:::tip Find a page
Use the sidebar and the top navigation bar to move between sections. The search bar at the top of the page runs on Typesense.
:::

<RedirectOldLinks />
