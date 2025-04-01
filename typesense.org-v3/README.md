# typesense.org (v3)

This Nuxt app powers the landing pages on typesense.org.

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Deployment

We use static site generation, and host the site on S3 frontend by Cloudfront.

```bash
npm run deploy
```

Locally preview production build:

```bash
npm run generate
npx serve .output/public
```