'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTicket(formData: FormData) {
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

    const { error } = await supabase.from('tickets').insert({
        title,
        description,
        department,
        priority,
        customer_id: user.id
    })

    if (error) {
        console.error('Ticket creation error:', error)
        return { error: 'Failed to create ticket' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
