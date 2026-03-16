'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTicket(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const department = formData.get('department') as string
    const priority = formData.get('priority') as string
    const description = formData.get('description') as string

    if (!title || !description || !department) {
        return { error: 'Please fill in all required fields' }
    }

    const { data: ticket, error } = await supabase.from('tickets').insert({
        title,
        description,
        department,
        priority,
        customer_id: user.id
    }).select('id').single()

    if (error) {
        console.error('Ticket creation error:', error)
        return { error: error.message }
    }

    // Trigger AI Assignment Edge Function
    if (ticket?.id) {
        // We don't await this to keep the response fast for the user
        // The assignment happens in the background
        supabase.functions.invoke('assign-ticket', {
            body: { ticket_id: ticket.id }
        })
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
