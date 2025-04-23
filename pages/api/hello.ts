import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'
import type { HelloWorldResponse } from '../../types/edge'

type ResponseData = {
  message: string
  timestamp: number
  user?: string | null
  edgeResponse?: HelloWorldResponse | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Get user session (if authenticated)
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  // Call the Edge Function (optional)
  let edgeResponse: HelloWorldResponse | null = null
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/hello-world`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name: user?.email?.split('@')[0] || 'API' }),
      }
    )

    if (response.ok) {
      edgeResponse = await response.json()
    }
  } catch (error) {
    console.error('Error calling Edge Function:', error)
  }

  // Return response
  res.status(200).json({
    message: `Hello from the API, ${user?.email?.split('@')[0] || 'anonymous user'}!`,
    timestamp: Date.now(),
    user: user?.email || null,
    edgeResponse,
  })
}