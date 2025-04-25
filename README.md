# SupaNext Template

A simplified template for Next.js and Supabase projects with TypeScript and Tailwind CSS.

## Features

- 🚀 **Next.js** with App Router
- 🔐 **Supabase** for authentication and database
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🧩 **Simple component structure** for easy customization

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/supanext-template.git

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

## Project Structure

```
app/                  # Next.js App Router pages
  ├─ page.tsx         # Home page
  ├─ layout.tsx       # Root layout
  ├─ dashboard/       # Dashboard page
  └─ login/           # Login page
components/           # React components
  ├─ Button.tsx       # Button component
  ├─ Card.tsx         # Card component
  ├─ Header.tsx       # Header component
  └─ auth/            # Auth-related components
lib/                  # Utility functions and shared code
  ├─ constants.ts     # Application constants
  ├─ supabase.ts      # Supabase client and helpers
  └─ utils.ts         # Utility functions
public/               # Static assets
styles/               # Global styles
types/                # TypeScript type definitions
```

## Main Components

- **Button**: Customizable button component with variants
- **Card**: Card component for displaying content in boxes
- **Header**: Site header with navigation

## License

MIT