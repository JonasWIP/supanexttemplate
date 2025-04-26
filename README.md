# SupaNext Template

A simplified template for Next.js and Supabase projects with TypeScript and Tailwind CSS.

## Features

- 🚀 **Next.js** with App Router
- 🔐 **Supabase** for authentication and database
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🧩 **Simple component structure** for easy customization

## Getting Started

npx create-supabase-next <project-name> or npx create-supabase-next --template <template-url>

cd <project-name>

npm install



TO start a local supabase instance:
Start Docker-Engine
npx supabase start

TO run the fronend development server:
npm run dev

npm install -g supabase
Starte eine lokale Supabase-Instanz:


(not needed if installed with npx create-supabase-next) npx supabase init
(use npx supabase init --force if you want to overwrite the existing supabase folder and start again)

Start 
npx supabase start


When you run `npx supabase start`, you'll receive local development credentials like:

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

Save these credentials somewhere safe. You'll need them to configure your LOCAL environment variables.
Replace the values in `.env.local` with the ones you received from `npx supabase start`.

If using this setup you can acces your local supabase dashboard under : http://127.0.0.1:54323


troubleshooting:
npm install -g supabase@latest


## Database Migrations


Link local supabase instance to your project with the following command:
```bash
npx supabase link
```
Select the project you want to link to.
Enter the password from the creation on supabase.com for the project.


Create your first migration with the following command:
Create tables or use the 001_initial.sql file in the migrations folder to create your tables.

Apply the migration to the database with the following command:
```bash
npx supabase db push
```

Create a migration from the existing database using file with the following command:
```bash
npx supabase db diff --schema public --file migrations/001_initial.sql
```

For Deployment
supabase db push --project-ref your-prod-project-id


npx supabase migration up

//Generate types file from local supabase instance
npx supabase gen types typescript --db-url "postgresql://postgres:postgres@localhost:54322/postgres" > lib/database.types.ts


To update local migrations to match remote database:
supabase db pull


Reset local database and reapply migrations:
```bash
npx supabase db reset
```

## License

MIT

## TODO
- Build pipelines for deployment via git
- Database tasks as package.json scripts
- init supabase project with supabase init --force
- automatic migration when push on main or pull from main branch
- Guide on creating new features and components etc. 
- Darkreader/mode support
- Better Colors when white mode
- Metadata for SEO
- Module hinzufügbar wie Zahlungsdienstleister
- Test Frameworks für Back und Frontend
- Register Link einfügen bei Login und navbar wenn nicht eingeloggt 