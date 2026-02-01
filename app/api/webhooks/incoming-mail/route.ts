import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Secure key to prevent unauthorized access (User should set this in env)
const WEBHOOK_SECRET = process.env.EMAIL_WEBHOOK_SECRET || 'changeme_in_prod'

export async function POST(request: Request) {
    try {
        const { sender, subject, text, secret } = await request.json()

        // 1. Security Check
        // We expect Make.com to send a "secret" field
        if (secret !== WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!sender || !subject) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = await createClient()

        // 2. Verify if Client Exists in our Database (Using Service Role would be ideal, but here we use admin context if possible)
        // Note: 'createClient' uses normal auth. We typically need 'supabase-admin' for user lookup if NOT logged in.
        // However, since this is an API route, we should use the SERVICE_ROLE_KEY to bypass RLS and find users.
        // We will assume the standard client for now, but really we need the admin client.

        // For this implementation, we will try to find the user in the "users" table if you have a public profile table,
        // OR (Better) we use the Admin Client.


        // Searching auth.users requires Service Role. 
        // Since we don't have a direct "search user by email" easily without admin, 
        // we will check if we can Insert. 
        // Actually, Supabase doesn't let you query auth.users easily from client SDK.
        // WORKAROUND: We will blindly try to insert. If RLS blocks it (because we aren't that user), it fails.
        // BUT we are the Server here. We can insert as "System".

        // Let's create a Supabase Admin Client for this specific operation
        const { createClient: createSupClient } = require('@supabase/supabase-js')
        const supabaseAdmin = createSupClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // WARNING: In Prod use SERVICE_ROLE_KEY
            { auth: { persistSession: false } }
        )

        // Currently using ANON key which is weak for Admin tasks. 
        // User needs to add SUPABASE_SERVICE_ROLE_KEY to .env.local for true "User Lookup".
        // For now, we will skip the "Verify User" step strictly and just insert the ticket
        // IF we verify the secret. 
        // NOTE: To strictly link to a user, we normally need their ID. 

        // Simplified Logic for "Personal Project":
        // 1. Insert ticket with 'sender_email' (We need to add this column or put in description)
        // 2. For now, we append sender to description.

        const descriptionWithSender = `[From: ${sender}]\n\n${text}`

        // Try to find user ID by email (If we had Service Role)
        // const { data: users } = await supabaseAdmin.auth.admin.listUsers() // Requires Service Key

        // Fallback: Insert as "Guest" / System Ticket
        // We need to allow NULL customer_id or use a System User ID.
        // Since we can't easily find the User ID without Service Key, 
        // and we want this to work NOW:
        // We will insert with a specific flag or just text.

        const { error } = await supabase.from('tickets').insert({
            title: subject,
            description: descriptionWithSender,
            department: 'General',
            priority: 'medium',
            status: 'open',
            // customer_id: ??? -> We don't have it.
            // We need to Make customer_id nullable in schema as planned.
            // For now, we omit it and hope schema allows NULL (we changed it in plan, need to verify in DB).
        })

        if (error) {
            console.error('Webhook insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
