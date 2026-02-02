'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/signup?error=Could not authenticate user&mode=login')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` : 'http://localhost:3000/auth/callback',
        },
    })

    if (error) {
        console.error('Signup error:', error)
        redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/signup?message=Check email to continue sign in process')
}

export async function signInWithGoogle() {
    const supabase = await createClient()

    // Get the base URL ensuring it's correct for both local and prod
    // 1. Explicitly set BASE_URL (Best practice)
    // 2. Vercel Production URL (Auto-set by Vercel)
    // 3. Vercel Preview URL (Auto-set by Vercel)
    // 4. Localhost fallback
    const getURL = () => {
        let url =
            process.env.NEXT_PUBLIC_BASE_URL ?? // Set this to your site URL in production env.
            process.env.VERCEL_URL ?? // Automatically set by Vercel (Server Side).
            process.env.NEXT_PUBLIC_VERCEL_URL ?? // Client side fallback.
            'http://localhost:3000/'

        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`
        // Remove trailing slash if present
        url = url.replace(/\/$/, '')
        return url
    }

    const origin = getURL()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error('Google Sign-in error:', error)
        redirect('/login?error=Could not initiate Google login')
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
