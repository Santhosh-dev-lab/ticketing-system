import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  try {
    const body = await req.json()
    console.log('Received request body:', body)
    const { agent_id } = body

    if (!agent_id) {
      console.error('Error: agent_id is missing')
      return new Response(JSON.stringify({ error: "agent_id is required" }), { status: 400 })
    }

    console.log('Initializing Supabase client...')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    console.log('Fetching profile for agent_id:', agent_id)
    // 1. Fetch agent details
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("expertise")
      .eq("id", agent_id)
      .single()

    if (fetchError || !profile) {
      throw new Error(`Failed to fetch profile: ${fetchError?.message}`)
    }

    if (!profile.expertise) {
       console.log('No expertise text found for agent. Skipping embedding.')
       return new Response(JSON.stringify({ message: "No expertise text to embed" }), { status: 200 })
    }

    console.log('Generating embedding via Gemini...')
    if (!GEMINI_API_KEY) {
      console.error('Error: GEMINI_API_KEY is not set')
      throw new Error('GEMINI_API_KEY is missing from environment variables')
    }

    // 2. Generate embedding via Gemini (gemini-embedding-001)
    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: profile.expertise }]
        },
        output_dimensionality: 768
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (!embeddingResponse.ok) {
      throw new Error(`Gemini Error: ${JSON.stringify(embeddingData.error)}`)
    }

    const embedding = embeddingData.embedding.values

    console.log('Saving embedding to database...')
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ expertise_embedding: embedding })
      .eq("id", agent_id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Update Error: ${updateError.message}`)
    }

    console.log('Embedding updated successfully!')

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error) {
    console.error('Unhandled Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { "Content-Type": "application/json" },
      status: 500 
    })
  }
})
