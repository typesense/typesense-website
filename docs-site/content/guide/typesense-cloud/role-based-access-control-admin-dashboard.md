# Role-Based Access Control (RBAC) for Admin Dashboard in Typesense Cloud

:::warning NOTE
This article only applies to Typesense Cloud's Admin Dashboard.

If you're looking to implement Role-Based Access Control (RBAC) for documents stored in Typesense, 
you want to use <RouterLink :to="`/${$site.themeConfig.typesenseLatestVersion}/api/api-keys.html#generate-scoped-search-key`">Scoped Search API Keys</RouterLink>.
:::

In **Typesense Cloud**, when you have a [team account](./team-accounts.md), you can assign roles to each member of your team to scope their access to various parts of the dashboard.

You'll find this option on your team's account page.

Here are the roles available and their corresponding permissions:

| Role            | Scope                                                                                                                             |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Administrator   | Has full unrestricted access to the team account                                                                                  |
| Super User      | Has full access to the team account, except for user management and billing information                                           |
| Developer       | Has access to all clusters and their dashboards, but cannot provision / terminate clusters or manage users or billing information |
| Curator         | Only has access to the following sections of the cluster dashboard: Search, Synonyms and Curation                                 |
| Billing Manager | Only has access to account billing management areas                                                                               |

By default new team members are assigned the Administrator role, but you can change this default setting to a different role(s) from your team account page. 