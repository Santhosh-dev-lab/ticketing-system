'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { signout } from '@/app/login/actions'
import LogoutButton from '@/components/LogoutButton'

export default function Header({ title }: { title: string }) {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setUser(profile)
            }
        }
        getUser()
    }, [supabase])

    return (
        <header className="h-20 border-b border-white/5 bg-[#0B0E14] flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>

            <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-white">{user?.full_name || 'Loading...'}</span>
                    <span className="text-xs text-white/40 font-medium capitalize">{user?.role || 'User'}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-white/5">
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <form action={signout}>
                    <LogoutButton />
                </form>
            </div>
        </header>
    )
}
