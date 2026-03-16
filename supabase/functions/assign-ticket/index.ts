import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  try {
    const { ticket_id } = await req.json()

    if (!ticket_id) {
      return new Response(JSON.stringify({ error: "ticket_id is required" }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Fetch ticket details
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("title, description, department")
      .eq("id", ticket_id)
      .single()

    if (fetchError || !ticket) {
      throw new Error(`Failed to fetch ticket: ${fetchError?.message}`)
    }

    const content = `${ticket.title}\n${ticket.description}`

    // 2. Generate embedding via OpenAI
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: content,
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (embeddingData.error) {
      throw new Error(`OpenAI Error: ${embeddingData.error.message}`)
    }

    const embedding = embeddingData.data[0].embedding

    // 3. Save embedding to ticket
    await supabase
      .from("tickets")
      .update({ semantic_embedding: embedding })
      .eq("id", ticket_id)

    // 4. Match agents using the RPC function from our migration
    const { data: matchedAgents, error: matchError } = await supabase.rpc("match_agents", {
      query_embedding: embedding,
      match_threshold: 0.1, // Adjust as needed
      match_count: 1,
      target_department: ticket.department
    })

    if (matchError) {
      throw new Error(`Match Error: ${matchError.message}`)
    }

    if (!matchedAgents || matchedAgents.length === 0) {
       return new Response(JSON.stringify({ message: "No matching agent found" }), { status: 200 })
    }

    const bestAgent = matchedAgents[0]

    // 5. Assign ticket
    const { error: assignError } = await supabase
      .from("tickets")
      .update({ assigned_to: bestAgent.id, status: 'open' })
      .eq("id", ticket_id)

    if (assignError) {
      throw new Error(`Assignment Error: ${assignError.message}`)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      assigned_to: bestAgent.id,
      agent_name: bestAgent.full_name,
      similarity: bestAgent.similarity
    }), { 
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
