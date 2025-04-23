# Supabase + Next.js Project

This is a full-stack application template built with [Supabase](https://supabase.com) and [Next.js](https://nextjs.org), featuring TypeScript, Tailwind CSS, and CI/CD workflows.

## 📋 Features

- **Authentication** - Email/password and social login via Supabase Auth
- **Database** - PostgreSQL database with Row Level Security
- **API** - RESTful API endpoints with Next.js API routes
- **Edge Functions** - Serverless functions with Supabase Edge Functions
- **Styling** - Tailwind CSS for styling
- **TypeScript** - Type safety throughout the application
- **CI/CD** - GitHub Actions workflows for testing and deployment
- **Vercel Integration** - Seamless deployment to Vercel

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Update the environment variables in `.env.local` with your Supabase project details

5. Start the development server:

```bash
npm run dev
```

6. Start the local Supabase development environment:

```bash
supabase start
```

7. Run the initialization script:

```bash
bash scripts/init.sh
```

## 📁 Project Structure

```
my-app/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   ├── functions/
│   │   └── hello-world/index.ts
│   └── config.toml
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml
│   │   └── test.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature_request.md
│   │   └── bug_report.md
│   └── PULL_REQUEST_TEMPLATE.md
├── .vercel/project.json
├── scripts/
│   └── init.sh
├── lib/
│   ├── supabaseClient.ts
│   └── types.generated.ts
├── types/
│   ├── api.ts
│   └── edge.ts
├── pages/
│   ├── index.tsx
│   └── api/
│       └── hello.ts
├── components/
│   └── Header.tsx
├── public/
│   └── logo.png
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── middleware.ts
├── tailwind.config.ts
├── postcss.config.js
├── .env.local
└── README.md
```

## 🧪 Development Workflow

### Database Migrations

Create a new migration:

```bash
supabase migration new feature_xyz
```

Apply migrations:

```bash
supabase db push
```

Reset database and apply seed data:

```bash
supabase db reset --seed
```

### Edge Functions

Serve edge functions locally:

```bash
supabase functions serve
```

Deploy edge functions:

```bash
supabase functions deploy
```

### TypeScript Types

Generate TypeScript types from your Supabase database:

```bash
npx supabase gen types typescript --local > lib/types.generated.ts
```

## 🔐 Security

This template uses Row Level Security (RLS) to secure your data. Make sure to:

1. Always enable RLS on your tables
2. Define appropriate policies for each table
3. Use API routes or Edge Functions for write operations that require validation
4. Use direct database queries for read operations with proper RLS policies

## 📘 Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🧠 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.