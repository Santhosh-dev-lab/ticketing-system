import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export type UserRole = 'customer' | 'agent' | 'admin'

export const getUserRole = cache(async (): Promise<UserRole> => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'customer'

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return (profile?.role as UserRole) || 'customer'
})
