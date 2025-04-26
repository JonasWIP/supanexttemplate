# SupaNext Template

A simplified template for Next.js and Supabase projects with TypeScript and Tailwind CSS.

## Features

- 🚀 **Next.js** with App Router
- 🔐 **Supabase** for authentication and database
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🧩 **Simple component structure** for easy customization

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
YOUR_PROJECT_REF | Dein Supabase Projekt-ID

5. Commit any changes to main and push to GitHub. This will trigger a deployment on Vercel and update supabase.

Following these steps will prepare your project for both local development and a smooth production deployment.

#### Supabase Authentication Setup

Supabase uses the "Site URL" to generate email links (e.g., magic links, password resets). To configure this in your project, follow these steps:

1. Open your Supabase Dashboard and select your project.
2. Navigate to Settings → Auth → URL Configuration.
3. Update the "Site URL" field with your production domain. For example:

  ```
  https://your-production-domain.com
  ```

## Test
Currently it runs npm test and checks if for compile errors and if the tests are running.
Jest is used for testing. You can add your own tests in the __tests__ folder.

## TODO
- Add Testing to CI/CD
- Expain Testing in readme
- Remove Debugging Logs and console logs

- Metadata for SEO
- Remove unused files and folders

- Refactoring of the codebase
- 

- Test Setup using the npx creation tool
- Final Testing and remove hints 

- Dependabot for the project


## Future Improvements

- Add roomodes, project specific instructions, fill gaps of knowledge for ai models
- Add mcp tools for the used ai agent models
- Integration in
- Module hinzufügbar wie Zahlungsdienstleister, Three.js
- Automating More of the setup process
- Full integration into a Custom Managment System with frontend and development tools




## License

MIT
