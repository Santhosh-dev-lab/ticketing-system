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
    const description = formData.get('description') as string

    if (!title || !description) {
        return { error: 'Please fill in all required fields' }
    }

    const { data: ticket, error } = await supabase.from('tickets').insert({
        title,
        description,
        customer_id: user.id
    }).select('id').single()

    if (error) {
        console.error('Ticket creation error:', error)
        return { error: error.message }
    }

    // Trigger AI Assignment Edge Function
    if (ticket?.id) {
        const { createServiceRoleClient } = await import('@/utils/supabase/service-role')
        const adminSupabase = createServiceRoleClient()
        
        const { error: invokeError } = await adminSupabase.functions.invoke('assign-ticket', {
            body: { ticket_id: ticket.id }
        })
        if (invokeError) {
            console.error('AI Assignment invocation error:', invokeError)
        }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
