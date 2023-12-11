# Single-Sign On (SSO) in Typesense Cloud

In Typesense Cloud, you can integrate any SAML-based Single Sign-On platform(s) to give designated users in your organization access to your [team account](./team-accounts.md), 
using their existing SSO credentials.

:::tip Our SAML-integration is platform agnostic

We've tested our SAML integration with popular SSO vendors like Okta, Azure Active Directory, Microsoft Entra ID, Google SSO and Rippling SSO,
but you can integrate **any SSO vendor** that offers SAML-based SSO with Typesense Cloud.

:::

## How much does SSO cost?

We believe that good security is not an optional feature, so we make SSO available to all teams without any additional charges.

## How to configure SSO

Here's how to set up SSO for a team in Typesense Cloud:

### Step 1: Set up a team

1. [Sign up](https://cloud.typesense.org/signup) for an account on Typesense Cloud using regular email/password-based authentication.
2. Click on your email address on the top right of the page (which will open up the accounts switcher) and click on "New Team".
3. Give your team a name, specify a contact email and click on "Create Team".
4. For security and verification purposes, we require a valid payment method on file for your team account before you can set up SSO for it (even though we do not charge extra for SSO).
   So once you create your team, click on "account" in the top navbar, scroll down to the "Billing" section and add a Payment Method to your team account.

We now need to set up your SSO platform to continue the setup.

### Step 2: Configure your SSO platform

1. Create a new "app" in your SSO platform following their documentation, and name the app "Typesense Cloud - \<your team name\>". Or if you only have a single team, you can also name the app "Typesense Cloud". 

   Note: Any users you give access to this app in your SSO platform, will be able to log in to Typesense Cloud and automatically access the team you created above.

2. Use any placeholder values in your SSO platform for the following values (we'll come back to fill these in later): 
   
   - SP Single Sign-On URL (also called Reply URL or Assertion Consumer Service URL in some SSO platforms)
   - SP Entity ID (also called Audience URI in some SSO platforms)

3. Use the image [here](/docs/images/typesense_cloud_logo.svg) as your SSO app's logo, to make it easy for your users to identify the app in your SSO portal.

4. Once you've created the app, your SSO platform should give you the following information:

   - IdP Single Sign-On URL (also called Identity Provider Single Sign-On URL or Login URL in some SSO platforms)
   - IdP Entity ID (also called Identity Provider Issuer or AD Identifier in some SSO platforms)
   - IdP Certificate (also called Identify Provider X.509 Certificate or Token singing certificate in some SSO platforms) - in base64 format (should start with `-----BEGIN CERTIFICATE-----` and end with `-----END CERTIFICATE-----`.

We'll now continue the setup in Typesense Cloud. 

### Step 3: Configure Typesense Cloud to use your SSO platform

1. Once you've added your payment method to your team account in Step 1, visit the "account" page in the top navbar once again, scroll down to the "Team Management" section and click on "Configure SSO".
2. Click on "Setup New Identity Provider".
3. Enter the values you received from your SSO platform in Step 2 above, into the corresponding fields in Typesense Cloud.
4. Click on "Create"
5. Typesense Cloud will now give you the actual values to use in your SSO platform, for the fields you used placeholder values for in Step 2. 

We'll now finalize the setup in your SSO platform.

### Step 4: Link your SSO platform to Typesense Cloud

1. Copy-paste the "Service Provider Entity ID" that you see in Typesense Cloud, into the SP Entity ID field in your SSO platform (also called Audience URI in some SSO platforms).
2. Copy-paste the "Assertion Consumer Service URL" that you see in Typesense Cloud, into the SP Single Sign-On URL (also called Reply URL in some SSO platforms).
3. Configure your SSO app to send the following attributes, along with the corresponding data types (following their documentation):
   - `email` (format: unspecified, namespace: blank)
   - `first_name` (format: unspecified, namespace: blank)
   - `last_name` (format: unspecified, namespace: blank)

::: tip For Rippling SSO

Please set:

- "Disable automatic standardization of attributes" to "Yes".
- "Use SAML standard namespaces for xml metadata/attributes" to "Yes".

:::

And that's it for one-time setup.

## How to login via SSO

There are two ways to log in to Typesense Cloud once you've configured SSO. 

### Option 1: Typesense Cloud-initiated login

This is also called the SP-initiated SSO in common terminology. 

You'll find a unique SSO-login link in Typesense Cloud, that you can pass on to your team to log in and access their team: 

1. As an admin, switch to your team account using the account switcher on the top right.
2. Scroll down to "Team Management" and click on "Configure SSO".
3. Click on the SSO platform you configured above
4. Scroll down to "User-Facing Information" and you'll find the "Single Sign-on URL" that your users can use to log in.

Accessing this link, will redirect users to your configured SSO platform, and then log them in if your SSO platform allows it.

### Option 2: SSO platform-initiated login

This is also called IdP-initiated SSO in common terminology.

Your users can visit your organization's SSO portal and click on the Typesense Cloud app to log in.

## Access Control

### How to grant users access

Once you've configured SSO for a team in Typesense Cloud, to add new users, you only need to give them access to the SSO app in your SSO platform. 

When the user logs in for the first time, Typesense Cloud will automatically create a new user account and add the account to your Typesense Cloud team. 
So you don't have to explicitly provision users in Typesense Cloud each time. 

### How to remove users

Removing a user's access from your SSO platform will remove their access from Typesense Cloud _for their next session_. 
If you need to revoke their access immediately, you want to _also_ visit your team's account page and remove the user from under the "Team Management" section. 

### Role-based access control

You can assign roles with different permissions to each user in your team, however this needs to be done from within Typesense Cloud.

Read this dedicated guide article on [Role-Based Access Control](./role-based-access-control-admin-dashboard.md) for more information.

## Questions?

Email us at support at typesense dot org if you have any questions or run into any issues.