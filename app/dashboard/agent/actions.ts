'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function claimTicket(ticketId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Optional: Verify user is an agent here for better error messages
    // But RLS will ultimately enforce permissions

    // Check if ticket is already assigned
    const { data: ticket } = await supabase
        .from('tickets')
        .select('assigned_to')
        .eq('id', ticketId)
        .single()

    if (ticket?.assigned_to) {
        return { error: 'Ticket is already assigned' }
    }

    const { error } = await supabase
        .from('tickets')
        .update({
            assigned_to: user.id,
            status: 'in-progress' // Auto-move to in-progress
        })
        .eq('id', ticketId)

    if (error) {
        console.error('Claim ticket error:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/agent')
    return { success: true }
}
