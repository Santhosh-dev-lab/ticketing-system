import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  try {
    const { agent_id } = await req.json()

    if (!agent_id) {
      return new Response(JSON.stringify({ error: "agent_id is required" }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

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
       return new Response(JSON.stringify({ message: "No expertise text to embed" }), { status: 200 })
    }

    // 2. Generate embedding via Gemini
    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: {
          parts: [{ text: profile.expertise }]
        }
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (!embeddingResponse.ok) {
      throw new Error(`Gemini Error: ${JSON.stringify(embeddingData.error)}`)
    }

    const embedding = embeddingData.embedding.values

    // 3. Save embedding to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ expertise_embedding: embedding })
      .eq("id", agent_id)

    if (updateError) {
      throw new Error(`Update Error: ${updateError.message}`)
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { "Content-Type": "application/json" },
      status: 500 
    })
  }
})
