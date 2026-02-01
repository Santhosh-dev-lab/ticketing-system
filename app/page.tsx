import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center justify-center min-h-screen bg-gray-50">
      <nav className="w-full flex justify-center border-b border-gray-200 h-16 bg-white/80 backdrop-blur-md fixed top-0 z-50">
        <div className="w-full max-w-5xl flex justify-between items-center p-4 text-sm">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            TicketSys_
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Hey, {user.email}</span>
                <form action="/auth/signout" method="post">
                  <button className="py-2 px-4 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all text-xs uppercase tracking-wider font-medium">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="font-medium hover:text-gray-600 transition-colors">Login</Link>
                <Link href="/signup" className="py-2 px-6 rounded-full bg-black text-white hover:bg-gray-800 transition-all font-medium text-xs uppercase tracking-wider">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-8 items-center justify-center px-4 text-center mt-32 max-w-4xl mx-auto">
        <h1 className="font-bold text-7xl lg:text-8xl tracking-tighter text-black animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Support.<br />Made Simple.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The fastest way to manage customer inquiries and drive satisfaction.
          Powerful, intuitive, and built for modern teams.
        </p>
        {!user && (
          <div className="flex gap-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/signup" className="px-10 py-4 rounded-full bg-black text-white font-medium text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
              Start for Free
            </Link>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs text-gray-500">
        <p>
          Powered by{' '}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
          {' '}&{' '}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Next.js
          </a>
        </p>
      </footer>
    </div>
  )
}
