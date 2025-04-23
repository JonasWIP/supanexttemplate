# PowerShell initialization script for Supabase + Next.js project

# Exit on error
$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "Starting project initialization..."

# Check if Supabase CLI is installed
try {
    $supabase = Get-Command supabase -ErrorAction Stop
    Write-Output "Supabase CLI is installed."
} catch {
    Write-ColorOutput Red "Supabase CLI is not installed."
    Write-Output "Please install it by running: npm install -g supabase"
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercel = Get-Command vercel -ErrorAction Stop
    Write-Output "Vercel CLI is installed."
} catch {
    Write-ColorOutput Yellow "Vercel CLI is not installed. Some features may not work."
    Write-Output "Consider installing it by running: npm install -g vercel"
}

# Initialize Supabase if not already initialized
if (-not (Test-Path "supabase\config.toml")) {
    Write-ColorOutput Green "Initializing Supabase..."
    supabase init
}

# Start Supabase local development environment
Write-ColorOutput Green "Starting Supabase local development environment..."
supabase start

# Generate TypeScript types
Write-ColorOutput Green "Generating TypeScript types..."
npx supabase gen types typescript --local > lib\types.generated.ts
Write-ColorOutput Green "TypeScript types generated successfully."

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-ColorOutput Green "Creating .env.local file..."
    
    # Get Supabase URL and anon key
    $supabaseStatus = supabase status --output json | ConvertFrom-Json
    $SUPABASE_URL = $supabaseStatus.api_url
    $SUPABASE_ANON_KEY = $supabaseStatus.anon_key
    
    # Create .env.local file
    @"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    
    Write-ColorOutput Green ".env.local file created successfully."
}

# Link with Vercel if Vercel CLI is installed
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-ColorOutput Green "Linking project with Vercel..."
    vercel link --confirm
    
    # Pull environment variables from Vercel
    Write-ColorOutput Green "Pulling environment variables from Vercel..."
    vercel env pull .env.local
}

Write-ColorOutput Green "Project initialization completed successfully!"
Write-Output "You can now run 'npm run dev' to start the development server."