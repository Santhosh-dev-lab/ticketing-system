import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

serve(async (req) => {
  try {
    const body = await req.json()
    console.log('Received request body:', body)
    const { ticket_id } = body

    if (!ticket_id) {
      console.error('Error: ticket_id is missing')
      return new Response(JSON.stringify({ error: "ticket_id is required" }), { status: 400 })
    }

    console.log('Initializing Supabase client...')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    console.log('Fetching details for ticket_id:', ticket_id)
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
    console.log('Generating embedding for content length:', content.length)

    if (!GEMINI_API_KEY) {
      console.error('Error: GEMINI_API_KEY is not set')
      throw new Error('GEMINI_API_KEY is missing from environment variables')
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
          parts: [{ text: content }]
        }
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (!embeddingResponse.ok) {
        throw new Error(`Gemini Error: ${JSON.stringify(embeddingData.error)}`)
    }

    const embedding = embeddingData.embedding.values

    console.log('Saving embedding to ticket...')
    await supabase
      .from("tickets")
      .update({ semantic_embedding: embedding })
      .eq("id", ticket_id)

    console.log('Querying for best matching agent in department:', ticket.department)
    // 4. Match agents using the RPC function (updated for 768 dimensions)
    const { data: matchedAgents, error: matchError } = await supabase.rpc("match_agents", {
      query_embedding: embedding,
      match_threshold: 0.1, 
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
    console.log('Found best agent:', bestAgent.full_name, 'with similarity:', bestAgent.similarity)

    // 5. Assign ticket
    console.log('Assigning ticket to agent...')
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
    console.error('Unhandled Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { "Content-Type": "application/json" },
      status: 500 
    })
  }
})
