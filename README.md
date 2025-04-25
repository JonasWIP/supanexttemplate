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







## License

MIT