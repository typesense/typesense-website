# Team Accounts in Typesense Cloud

In Typesense Cloud, you can share access to your clusters with members of your team (without having to distribute API keys to each user). 

We create "teams" in Typesense for each GitHub organization you're a part of. 
This is automatically done when you login the first time (if you had authorized access to your GitHub orgs).

Once you're logged in, you'll see an account switcher on the top right with your username. 
If you click on your username, you'll see the other team accounts. 

If you then provision a cluster under one of those team accounts, all members that are part of your GitHub organization will also see the cluster when they login with their own GitHub accounts, and switch to this team.

:::tip
If you don't see an account switcher when you login to Typesense Cloud, or don't see a particular team, you most likely didn't grant access to the corresponding GitHub org when you logged in the first time.

To remedy this, you want to visit [https://github.com/settings/applications](https://github.com/settings/applications), remove Typesense Cloud from the list, then logout of Typesense Cloud and log back in. 
This time, you'll see the GitHub prompt to authorize organization access, you want to enable the organization that you'd like to create clusters under.
:::

Let me know if you run into any issues.