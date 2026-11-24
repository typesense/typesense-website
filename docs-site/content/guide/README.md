---
title: "Get Started with Typesense: Quickstart and Tutorials"
description: "Get your first Typesense search running: give a prompt to your AI agent, scaffold an app with create-typesense-app, or follow the guides."
sidebarDepth: 1
---

# Get Started with Typesense

The guide section of the documentation walks you through how to use Typesense in different scenarios. 

For a high-level overview of Typesense, what you can use it for, and some live-demos, read the [**Overview**](../overview/what-is-typesense.md) section. 
For a detailed dive into the Typesense API, refer to our <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/`"><strong>API Documentation</strong></RouterLink>.

Before you dive in, skim through Typesense's [key use cases](../overview/use-cases.md) (it's much more than full text search) and [live demos](../overview/demos.md). If you're switching over from Algolia, follow our [Migrating from Algolia](./migrating-from-algolia.md) guide, and for documentation site search, follow the [DocSearch](./docsearch.md) guide.

Here are a few ways to get your first Typesense search up and running, depending on how hands-on you'd like to be.

## Option 1: Use an AI agent

If you already work with a coding agent like Claude Code, Codex or Cursor, this is the most hands-off way to see Typesense in action. Copy this prompt into your agent, and it'll start a local Typesense server, load a sample dataset of books and build a small search page in a single `index.html` file, so you can try a few misspelled queries of your own. The agent does the typing here, so you want to skim through what it built once it's done. Here's the prompt:

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

:::tip
**Prefer Typesense Cloud?** Connect your agent to our [Typesense Cloud MCP server](./typesense-cloud/mcp-server.md), and it can spin up a cluster, index your data and run searches for you. You get to choose what the agent is allowed to do when you connect it.
:::

## Option 2: Scaffold your first Typesense app

If you'd rather start from a real project that you can keep building on, [`create-typesense-app`](https://www.npmjs.com/package/create-typesense-app) is our project scaffolder. Think `create-next-app`, but with a search engine and sample data already wired in. One command starts Typesense in Docker, loads a sample dataset of about 10,000 books and generates a Next.js app with a search UI that's connected to it. So you get a working, typo-tolerant search experience end to end, and the code is yours to change from there. To create the app and start it:

```bash
npx --yes create-typesense-app@latest my-search-app --yes
cd my-search-app
npm run dev
```

You'll need Node.js 22 or newer, and Docker running on your machine, since that's where the CLI starts the Typesense server.

Prefer a different framework, or already have a Typesense server or a Typesense Cloud cluster you'd like to use? Drop the final `--yes`, and the CLI will walk you through the options.

## Option 3: Do it by hand {#quick-start}

If you'd like to understand how each piece fits together, follow these articles in order. It takes a little longer than the other two options, but you'll know exactly what's happening under the hood by the end of it.

1. [Install Typesense](./install-typesense.md)
2. [Install a Client Library](./installing-a-client.md)
3. [Build a Search Application](./building-a-search-application.md)
4. [Build a Search UI](./search-ui-components.md)

## Going to Production

Whichever option you picked, you want to review our [Best Practices](./running-in-production.md) before you send production traffic to Typesense, since the article covers the configuration, monitoring and security settings we recommend for a production setup.

Read through the rest of the guide using the links in the left-side pane.

## Getting Help

We've strived to keep Typesense as self-service and out-of-the-box as possible, with fully public documentation. 

But if you have any questions, here are some ways to get additional help:

- Read through our [Frequently Asked Questions](/guide/faqs.md) or browse through the nav bar on the left-side pane in our [Guide](/guide/README.md) for relevant articles - we've put these articles together based on feedback from several users.
- Use GitHub's native search to search through past conversations in our [GitHub issue tracker](https://github.com/search?q=org%3Atypesense++issues&type=issues).
- Browse and search through [past conversations](https://threads.typesense.org/) in our Slack community.
- Open a [GitHub issue](https://github.com/typesense/typesense/issues) with any questions or bug reports.
- Join our public [Slack community](https://typesense.link/slack-community) to discuss general questions and/or issues.
- Schedule a call with a member of the core Typesense team, by [sponsoring Typesense on GitHub](https://github.com/sponsors/typesense?frequency=one-time) and picking the appropriate one-time sponsorship tier, and email us at contact at typesense dot org.
- We also offer prioritized paid support, with private Slack, email & phone-based support with guaranteed SLAs on Typesense Cloud. Learn more [here](https://cloud.typesense.org/support-plans).

---

<br>

:::tip Navigation Tip
Use the links on the left-side pane **and top navigation** bar to get to the appropriate section you're looking for.

Or use the search bar on the top of the page, which coincidentally is powered by Typesense.
:::

<RedirectOldLinks />
