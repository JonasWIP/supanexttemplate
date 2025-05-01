# Quick Start Guide

This guide will help you get started with the SupaNext Template quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (for local Supabase development)
- A [GitHub](https://github.com/) account (for deployment)
- A [Supabase](https://supabase.com/) account (free tier is fine for development)
- A [Vercel](https://vercel.com/) account (for deployment)

## Setup Process

### Creating Your Project

```bash
# Create a new project using the template
npx create-supabase-next <your-project-name>

# Navigate to the project directory
cd <your-project-name>
```

### Local Development Setup

1. **Start Supabase locally** (ensure Docker is running):
   ```bash
   npm run supabase:start
   ```
   This will start a local Supabase instance and output the URL and anon key.

2. **Configure Environment Variables**:
   Create a `.env.local` file in the project root with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Your Development Environment**:
   - Next.js application: [http://localhost:3000](http://localhost:3000)
   - Supabase Studio: [http://127.0.0.1:54323](http://127.0.0.1:54323)

### Production Deployment

> **Important:** All of the steps below (except 1 and 6-7) are about gathering different secrets that need to be added to your GitHub repository's environment secrets. You're essentially collecting values from different sources and adding them to GitHub in one place.

1. **Commit and push your project to GitHub**

2. **Configure GitHub Repository Secrets**:
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and Variables → Actions
   - Under "Manage environment secrets" → production → add environment secret:
   
   This is where you'll add all the secrets from the following steps.

3. **Create a Supabase project and gather secrets**:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project and copy the database password during creation
   - After project creation, click on "Connect" in the navbar
   - Copy credentials from the "App-Frameworks" section for these GitHub secrets:
     ```
     SUPABASE_DB_PASSWORD = Your Supabase database password
     NEXT_PUBLIC_SUPABASE_URL = Your Supabase project URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY = Your Supabase anon key
     YOUR_PROJECT_REF = Your Supabase project ID
     ```

4. **Create Supabase Access Token for another GitHub secret**:
   - Go to Account → Account settings → Access tokens
   - Create a new access token (name it "github" or similar)
   - Copy the token and add it as a GitHub repository secret:
     ```
     SUPABASE_ACCESS_TOKEN
     ```

5. **Setup Vercel Token for the final GitHub secret**:
   - Go to [Vercel Account Settings](https://vercel.com/account/settings/tokens)
   - Create a new token (name it "github" or similar)
   - Select your scope and set no expiration
   - Copy the token and add it as a GitHub repository secret:
     ```
     VERCEL_TOKEN
     ```

6. **Trigger Deployment**:
   - After adding all required GitHub secrets, commit and push changes to your repository
   - The GitHub workflow will automatically deploy your application
   - After deployment, you can access your site via the Vercel URL

7. **Configure Authentication Redirect**:
   - Set your Vercel live URL in your Supabase project dashboard as the redirect link for authentication
   - Go to Supabase Dashboard → your project → Authentication → URL Configuration
   - Update the Site URL and redirect URLs

## Connecting Local and Production Environments

To sync your local Supabase instance with the production database:

```bash
# Link local CLI to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Pull the remote database schema to local
npx supabase db pull

# Push local changes to remote
npx supabase db push
```

Check the package.json file for additional useful scripts.

## Troubleshooting

### Local Development Issues

- **Docker problems**: Ensure Docker is running and has sufficient resources allocated
- **Port conflicts**: Check if ports 3000, 54321, or 54323 are already in use
- **Supabase CLI errors**: Make sure you have the latest version installed

### Deployment Issues

- **GitHub Actions failures**: Check workflow logs for specific error messages
- **Vercel deployment errors**: Ensure all environment variables are correctly set
- **Supabase connection issues**: Verify the correct project ID and credentials are used

## Getting Help

If you encounter issues not covered in this guide:

- Check the comprehensive documentation in the `/docs` directory
- Explore the example implementations in the `/app/examples` directory
- Visit the [Supabase Documentation](https://supabase.com/docs) or [Next.js Documentation](https://nextjs.org/docs)
- Join the [Supabase Discord](https://discord.supabase.com) community