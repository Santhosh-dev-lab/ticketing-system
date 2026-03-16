import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
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

    // 2. Generate embedding via OpenAI
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: profile.expertise,
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (embeddingData.error) {
      throw new Error(`OpenAI Error: ${embeddingData.error.message}`)
    }

    const embedding = embeddingData.data[0].embedding

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
