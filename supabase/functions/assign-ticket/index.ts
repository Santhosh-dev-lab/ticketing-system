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
      .select("title, description")
      .eq("id", ticket_id)
      .single()

    if (fetchError || !ticket) {
      throw new Error(`Failed to fetch ticket: ${fetchError?.message}`)
    }

    const content = `${ticket.title}\n${ticket.description}`
    
    if (!GEMINI_API_KEY) {
      console.error('Error: GEMINI_API_KEY is not set')
      throw new Error('GEMINI_API_KEY is missing from environment variables')
    }

    // 2. Determine Department and Priority via Gemini Classify
    console.log('Classifying ticket department and priority...')
    const classificationResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Classify the following support ticket into a department and priority level.
            Departments: "General", "Technical Support", "Billing", "Feature Request"
            Priorities: "low", "medium", "high", "urgent"
            
            Ticket Title: ${ticket.title}
            Ticket Description: ${ticket.description}
            
            Return JSON only in this format: {"department": "...", "priority": "..."}`
          }]
        }],
        generationConfig: {
            response_mime_type: "application/json",
        }
      }),
    })

    const classificationData = await classificationResponse.json()
    if (!classificationResponse.ok) {
        throw new Error(`Gemini Classification Error: ${JSON.stringify(classificationData.error)}`)
    }

    const { department, priority } = JSON.parse(classificationData.candidates[0].content.parts[0].text)
    console.log(`AI Classification -> Department: ${department}, Priority: ${priority}`)

    // 3. Generate embedding via Gemini (gemini-embedding-001)
    console.log('Generating embedding for content...')
    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: content }]
        },
        output_dimensionality: 768
      }),
    })

    const embeddingData = await embeddingResponse.json()
    if (!embeddingResponse.ok) {
        throw new Error(`Gemini Embedding Error: ${JSON.stringify(embeddingData.error)}`)
    }

    const embedding = embeddingData.embedding.values

    console.log('Updating ticket with AI findings...')
    await supabase
      .from("tickets")
      .update({ 
        semantic_embedding: embedding,
        department: department,
        priority: priority
      })
      .eq("id", ticket_id)

    console.log('Querying for best matching agent in department:', department)
    // 4. Match agents using the RPC function
    const { data: matchedAgents, error: matchError } = await supabase.rpc("match_agents", {
      query_embedding: embedding,
      match_threshold: 0.05, // Lowered threshold for better testing
      match_count: 1,
      target_department: department
    })

    if (matchError) {
      throw new Error(`Match Error: ${matchError.message}`)
    }

    if (!matchedAgents || matchedAgents.length === 0) {
       console.log('No matching agent found in department. Ticket remains unassigned.')
       return new Response(JSON.stringify({ message: "No matching agent found", department, priority }), { status: 200 })
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
      department,
      priority,
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
