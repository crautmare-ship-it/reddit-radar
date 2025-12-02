This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Setup (Vercel Postgres)

Reddit Radar uses Vercel Postgres to store product and keyword settings. This is **free** on Vercel's Hobby tier.

### Setting up the Database on Vercel

1. **Create a Postgres Database**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to the Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name for your database (e.g., "reddit-radar-db")
   - Select a region close to your deployment
   - Click "Create"

2. **Connect Database to Your Project**
   - After creating the database, click "Connect Project"
   - Select your Reddit Radar project
   - The required environment variables will be automatically added to your project

3. **Environment Variables**
   - The following environment variables are automatically configured when you connect the database:
     - `POSTGRES_URL` - Connection string for the database
     - `POSTGRES_PRISMA_URL` - Connection pooling URL
     - `POSTGRES_URL_NON_POOLING` - Direct connection URL
     - `POSTGRES_USER` - Database username
     - `POSTGRES_HOST` - Database host
     - `POSTGRES_PASSWORD` - Database password
     - `POSTGRES_DATABASE` - Database name

4. **Database Tables**
   - Tables are automatically created when you first use the app
   - No manual SQL setup required!

### Local Development Without Database

For local development, you can run the app without setting up a database:
- The app will use in-memory storage (data won't persist between restarts)
- You'll see a warning message in the console
- This is useful for quick testing and development

If you want to use a database locally:
1. Create a `.env.local` file in the project root
2. Add your Vercel Postgres connection string:
   ```
   POSTGRES_URL="your-connection-string-here"
   ```
3. You can find the connection string in your Vercel Dashboard under Storage → your database → .env.local tab

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
