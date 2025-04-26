

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve((req) => {
  return new Response('Hello World from Supabase Functions!', {
    headers: { 'Content-Type': 'text/plain' },
  });
});
