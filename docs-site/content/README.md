---
sidebar:
 - '/'
 - Hello

---

# Typesense Documentation

👋 Welcome! Let's get you familiar with Typesense real quick.

## ;tldr

- If you want to dive right in, the <RouterLink :to="`${$site.themeConfig.typesenseLatestVersion}/guide/`"><strong>Guide</strong></RouterLink> is a good place to get started.
- Here's the <RouterLink :to="`${$site.themeConfig.typesenseLatestVersion}/api/`"><strong>API Reference</strong></RouterLink> for the latest version of Typesense.

## How the docs are organized

The documentation is divided into the following sections, that you'll find links for on the **top navigation bar**.

- [**Overview**](./overview/what-is-typesense.md) - This section is meant to give you a birds-eye view about Typesense, why you'd want to use it and comparison with alternatives.
- <RouterLink :to="`${$site.themeConfig.typesenseLatestVersion}/guide/`"><strong>Guide</strong></RouterLink> - This section walks you step-by-step through how you can use Typesense in different scenarios.
- <RouterLink :to="`${$site.themeConfig.typesenseLatestVersion}/api/`"><strong>API Reference</strong></RouterLink> - This section gives you detailed information about all the API endpoints in Typesense, along with information on configuration parameters.

:::tip
Use the version dropdown in the top navigation bar to switch between different versions of Typesense.
:::

## Help us improve the docs

This documentation site itself is open source. If you notice an issue on any page, just click on the Edit button at the bottom of the page, make changes and submit it as a PR. 

We also welcome contributions to the documentation, especially to the Guide section. If you've integrated Typesense with a framework that's not covered, we'd love to have you share that with the world. 
Please reach out to us to collaborate on this.

:::tip
Use the "Edit page" link at the botoom of any page to edit it and submit a PR. We appreciate your contributions.
:::

## Typesense Versions

Typesense is versioned software and each version has documentation specifically tied to it. You can use the dropdown on the top navigation bar to switch between versions.

But here are direct clickable links as well:

<ul>
  <li v-for="version in $site.themeConfig.typesenseVersions">
    <RouterLink :to="`${version}/`"> {{version}} </RouterLink>
  </li>
</ul>
