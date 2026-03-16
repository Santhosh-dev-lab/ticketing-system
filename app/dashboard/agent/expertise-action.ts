'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateExpertise(expertise: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ expertise })
        .eq('id', user.id)

    if (error) {
        console.error('Update expertise error:', error)
        return { error: error.message }
    }

    // Trigger Edge Function to generate embedding
    const { createServiceRoleClient } = await import('@/utils/supabase/service-role')
    const adminSupabase = createServiceRoleClient()

    const { error: invokeError } = await adminSupabase.functions.invoke('embed-agent', {
        body: { agent_id: user.id }
    })
    
    if (invokeError) {
        console.error('Embed agent invocation error:', invokeError)
    }
    
    revalidatePath('/dashboard/agent')
    return { success: true }
}
