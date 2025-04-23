#!/bin/bash
# Initialization script for Supabase + Next.js project

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting project initialization...${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI is not installed.${NC}"
    echo -e "Please install it by running: ${YELLOW}npm install -g supabase${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI is not installed. Some features may not work.${NC}"
    echo -e "Consider installing it by running: ${YELLOW}npm install -g vercel${NC}"
fi

# Initialize Supabase if not already initialized
if [ ! -f "supabase/config.toml" ]; then
    echo -e "${GREEN}Initializing Supabase...${NC}"
    supabase init
fi

# Start Supabase local development environment
echo -e "${GREEN}Starting Supabase local development environment...${NC}"
supabase start

# Generate TypeScript types
echo -e "${GREEN}Generating TypeScript types...${NC}"
npx supabase gen types typescript --local > lib/types.generated.ts
echo -e "${GREEN}TypeScript types generated successfully.${NC}"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${GREEN}Creating .env.local file...${NC}"
    
    # Get Supabase URL and anon key
    SUPABASE_URL=$(supabase status --output json | jq -r '.api_url')
    SUPABASE_ANON_KEY=$(supabase status --output json | jq -r '.anon_key')
    
    # Create .env.local file
    cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    
    echo -e "${GREEN}.env.local file created successfully.${NC}"
fi

# Link with Vercel if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}Linking project with Vercel...${NC}"
    vercel link --confirm
    
    # Pull environment variables from Vercel
    echo -e "${GREEN}Pulling environment variables from Vercel...${NC}"
    vercel env pull .env.local
fi

echo -e "${GREEN}Project initialization completed successfully!${NC}"
echo -e "You can now run ${YELLOW}npm run dev${NC} to start the development server."