// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface RequestParams {
  name?: string;
}

interface ResponseData {
  message: string;
  timestamp: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Get request params
    let params: RequestParams = {};
    
    if (req.method === "POST") {
      params = await req.json();
    } else {
      // For GET requests, parse URL query parameters
      const url = new URL(req.url);
      params.name = url.searchParams.get("name") || undefined;
    }

    // Prepare response
    const name = params.name || "world";
    const data: ResponseData = {
      message: `Hello, ${name}!`,
      timestamp: Date.now(),
    };

    // Return response with CORS headers
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    )
  }
})

/* To invoke locally:
 * 1. Run `supabase functions serve hello-world` in your terminal
 * 2. Make a request:
 *    curl -i --location --request POST 'http://localhost:54321/functions/v1/hello-world' \
 *    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
 *    --header 'Content-Type: application/json' \
 *    --data '{"name":"Functions"}'
 */