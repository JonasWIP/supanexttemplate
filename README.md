# SupaNext Template

A simplified template for Next.js and Supabase projects with TypeScript and Tailwind CSS.

## Features

- 🚀 **Next.js** with App Router for SSR and static generation.
- 🔐 **Supabase** for authentication and real-time database.
- 🎨 **Tailwind CSS** for modern styling with customization.
- 📝 **TypeScript** for robust type safety.
- 🧩 **Modular Component Structure** for simple and flexible customization.
- ✅ **Jest Testing** to ensure quality and catch compile errors early.
- 🛠 **Seamless Local Development** with integrated Supabase CLI for an effortless setup.
- 🚀 **Auto Deployment** via Vercel and GitHub Actions with Supabase CI/CD for continuous delivery.
- 🔄 **Smooth Migration Tasks** using automated scripts for database migrations.
- Fully deploy-ready template repository with integrated deployment pipelines.

## Getting Started

Follow these steps to set up your project:

1. Create your project:
    - Default template:  
      npx create-supabase-next <project-name>
    - Custom template:  
      npx create-supabase-next --template <template-url>

2. Navigate into your project directory:  
    cd <project-name>

3. Install dependencies:  
    npm install

---

## Running the Development Environment

### Starting Your Local Supabase Instance

1. Ensure Docker is running on your machine.
2. Start Supabase:
    - Using the npm script (if provided in package.json):  
      npm run supabase:start
    - Or directly:  
      npx supabase start

**Note:**  
- If you initially set up your project with npx create-supabase-next, Supabase is pre-initialized.
- To reinitialize (overwriting any existing configuration), run:  
  npx supabase init --force

When starting Supabase, you'll see local development credentials such as:

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: <your-jwt-secret>
anon key: <your-anon-key>
service_role key: <your-service-role-key>
S3 Access Key: <your-s3-access-key>
S3 Secret Key: <your-s3-secret-key>
S3 Region: local
```

Save these details securely and update your `.env.local` file with the provided values.

Access your Supabase dashboard at:  
http://127.0.0.1:54323

---

### Running the Frontend Development Server

Start your Next.js development server:
- Using npm script:  
  npm run dev

---

## Troubleshooting

If you experience issues with the Supabase CLI, update it globally:
npm install -g supabase@latest

## Migration Guide

npx supabase migration new migration_name  
edit the migration file in supabase/migrations/<timestamp>_migration_name.sql  
then either:  
npx supabase db reset  
or  
npx supabase db push

## Scripts

- Check the package.json file for available scripts.
- Contains Supabase commands for local development and deployment.

## Setting Up Your Environment and Deployment

Before you begin, ensure you have a Supabase project and the Supabase CLI installed. If not, refer to the [Supabase documentation](https://supabase.com/docs/guides/cli) for guidance. For local development, use your local Supabase instance.

### Local Development

1. Create a .env.local file in your project's root directory with the following content:
    ```
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

2. Start your local Supabase instance and verify that your Next.js app connects correctly.

### Production Deployment

1. Push your repository to GitHub.
2. In your GitHub repository, navigate to:
    Repository → Settings → Secrets and Variables → Actions.

3. If not done already, Signup to vercel, Create a Orgnaisation.

4. Set up an environment (e.g., Production) and add the following secrets:

VERCEL_TOKEN = A Access token from your vercel account allowing for organization access.  
NEXT_PUBLIC_SUPABASE_URL = https://<project-id>.supabase.co  
NEXT_PUBLIC_SUPABASE_ANON_KEY = (from https://supabase.com/dashboard/project/<project-id>/settings/api)

Create a new or use a existing Supabase project. You set the db password when creating the project.

SUPABASE_ACCESS_TOKEN | In Supabase → Account Settings → Personal Access Tokens → "New Token" erstellen  
SUPABASE_DB_PASSWORD | In Supabase → Settings → Database → "Connection string" → extrahiere das Passwort  
YOUR_PROJECT_REF | Your Supabase Project ID (can be found in the URL of your Supabase dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_REF)

5. Commit any changes to main and push to GitHub. This will trigger a deployment on Vercel and update supabase.

### Troubleshooting GitHub Workflow Deployments

If you encounter authentication errors during the GitHub Actions workflow, particularly with `supabase:dbpush` command:

1. **Verify your secrets**: Double-check that `SUPABASE_DB_PASSWORD` and `YOUR_PROJECT_REF` are correctly set in GitHub repository secrets.

2. **Password format**: Ensure your database password doesn't contain special characters that might need escaping in the bash script.

3. **Project reference**: Make sure the `YOUR_PROJECT_REF` secret matches exactly with your Supabase project ID.

4. **Access token permissions**: Verify that your Supabase access token has the necessary permissions for database operations.

5. **Manual linking test**: If issues persist, you can test the linking process locally with:
   ```
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   This might provide more specific error messages to help diagnose the issue.

Following these steps will prepare your project for both local development and a smooth production deployment.

#### Supabase Authentication Setup

Supabase uses the "Site URL" to generate email links (e.g., magic links, password resets). To configure this in your project, follow these steps:

1. Open your Supabase Dashboard and select your project.
2. Navigate to Settings → Auth → URL Configuration.
3. Update the "Site URL" field with your production domain. For example:

  ```
  https://your-production-domain.com
  ```

## Supabase Edge Functions

This template includes support for [Supabase Edge Functions](https://supabase.com/docs/guides/functions), which allow you to run server-side code without managing infrastructure.

### Local Development

To work with Edge Functions locally:

1. **Serve all functions locally**:
   ```bash
   npm run supabase:functions:serve
   ```
   This makes all functions available at `http://localhost:54321/functions/v1/[function-name]`.

2. **Serve a specific function** (e.g., hello-world):
   ```bash
   npm run supabase:functions:serve:hello-world
   ```

3. **Create a new function**:
   ```bash
   npm run supabase:functions:new my-function-name
   ```
   This will create a new function at `supabase/functions/my-function-name/`.

### Testing Edge Functions

The template includes example code for calling Edge Functions in both server and client components:

- **Server Component**: See `/app/examples/function-call/page.tsx`
- **Client Component**: See `/app/examples/function-call/ClientFunctionExample.tsx`

You can use the provided utility at `lib/supabase/functions.ts` to call functions:

```typescript
// Client-side with automatic auth
const result = await callSupabaseFunction('hello-world', { useAuth: true });

// Server-side with manual auth token
const result = await callSupabaseFunction('hello-world', { token: session?.access_token });
```

### Authentication with Edge Functions

Edge Functions can be used with or without authentication:

- **Public Access**: Anyone can call the function
- **Authenticated**: Requires a valid JWT token from Supabase Auth

The example function `hello-world` shows how to handle both scenarios.

### Deploying Edge Functions

To deploy Edge Functions to your Supabase project:

1. **Deploy all functions**:
   ```bash
   npm run supabase:functions:deploy
   ```

2. **Deploy a specific function** (e.g., hello-world):
   ```bash
   npm run supabase:functions:deploy:hello-world
   ```

3. **List deployed functions**:
   ```bash
   npm run supabase:functions:list
   ```

4. **Delete a function**:
   ```bash
   npm run supabase:functions:delete function-name
   ```

### CI/CD for Edge Functions

This template includes GitHub Actions workflows that automatically deploy your Edge Functions when you push to the main branch. The workflow:

1. Installs dependencies
2. Runs tests
3. Links your Supabase project
4. Deploys database migrations
5. Deploys Edge Functions
6. Deploys your Next.js app to Vercel

You can find the workflow configuration in `.github/workflows/deploy-vercel.yml`.

### Production URLs

Once deployed, your functions are available at:
```
https://<project-ref>.supabase.co/functions/v1/<function-name>
```

Replace `<project-ref>` with your Supabase project reference ID.

## Test

Currently it runs npm test and checks if for compile errors and if the tests are running.  
Jest is used for testing. You can add your own tests in the __tests__ folder.

## TODO

- Setup Tests for every page
- Home Page will be a short tutorial for the template, and what to setup and configure
- Remove issues, warnings from supabase and compile, setup
- Update / documentation and documentation structure
- Test the npx creation tool
- Final Testing 

## Future Improvements
- https://magicui.design/docs/components/marquee magicui ?
- Tests for Utisl and functions / auth / unauthenticated
- Add more examples for Edge Functions
- Metadata for SEO
- SEO
- Analytics
- Mobile Support (Capacitor?)
- Include knowledge gaps for ai models 
- Revampl the documentation to explain/summarize the project for ai models
- Add roomodes, project specific instructions, fill gaps of knowledge for ai models (context7,claude-task-master,https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- Add mcp tools for the used ai agent models
- Project summary
- Module hinzufügbar wie Zahlungsdienstleister, Three.js, Advertisment
- Automating More of the setup process
- Full integration into a Custom Managment System  with frontend and development tools or mcp usage

## License

MIT
