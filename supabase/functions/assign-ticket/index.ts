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

    // DEBUG: List available models
    try {
        const modelsResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
        const modelsData = await modelsResp.json()
        console.log('Available Models:', JSON.stringify(modelsData.models?.map((m: any) => m.name)))
    } catch (e) {
        console.error('Debug: Failed to list models', e)
    }

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

    // 2. Determine Department and Priority via Heuristics (Instant & Free)
    console.log('Classifying ticket via heuristics...')
    
    const classifyTicket = (title: string, desc: string) => {
        const text = `${title} ${desc}`.toLowerCase()
        
        let dept = "General"
        if (text.match(/bug|error|fail|broken|crash|technical|api|integration|issue/)) dept = "Technical Support"
        if (text.match(/bill|payment|stripe|invoice|money|charge|refund|subscription/)) dept = "Billing"
        if (text.match(/feature|request|suggest|add|new|improvement|want/)) dept = "Feature Request"

        let prio = "medium"
        if (text.match(/urgent|critical|blocker|broken|stop|asap|emergency/)) prio = "urgent"
        else if (text.match(/high|important|soon|billing/)) prio = "high"
        else if (text.match(/low|question|wondering|info/)) prio = "low"

        return { department: dept, priority: prio }
    }

    const { department, priority } = classifyTicket(ticket.title, ticket.description)
    console.log(`Heuristic Classification -> Department: ${department}, Priority: ${priority}`)

    // 3. Generate embedding via Gemini (gemini-embedding-001)
    // We wrap this in a try-catch to make it robust against Gemini downtime/quota
    let embedding = null
    try {
        console.log('Generating embedding for content...')
        const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "models/gemini-embedding-001",
                content: { parts: [{ text: content }] },
                output_dimensionality: 768
            }),
        })

        const embeddingData = await embeddingResponse.json()
        if (embeddingResponse.ok) {
            embedding = embeddingData.embedding.values
        } else {
            console.warn('Gemini Embedding failed, falling back to basic matching:', JSON.stringify(embeddingData.error))
        }
    } catch (e) {
        console.error('Gemini Embedding network error:', e)
    }

    console.log('Updating ticket with findings...')
    await supabase
      .from("tickets")
      .update({ 
        semantic_embedding: embedding,
        department: department,
        priority: priority
      })
      .eq("id", ticket_id)

    console.log('Querying for matching agent in department:', department)
    // 4. Match agents
    // If embedding failed, find any agent in the department
    let matchedAgents = []
    if (embedding) {
        const { data, error: matchError } = await supabase.rpc("match_agents", {
            query_embedding: embedding,
            match_threshold: 0.05,
            match_count: 1,
            target_department: department
        })
        if (!matchError) matchedAgents = data || []
    } else {
        // Fallback: Pick an agent from the department with lowest load
        const { data, error: fetchAgentsError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("role", "agent")
            .eq("department", department)
            .limit(1)
        if (!fetchAgentsError) {
             matchedAgents = data?.map(a => ({ ...a, similarity: 0 })) || []
        }
    }

    if (matchedAgents.length === 0) {
       console.log('No matching agent found. Ticket remains unassigned.')
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
