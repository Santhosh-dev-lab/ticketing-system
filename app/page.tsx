import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/login/actions'
import Link from 'next/link'
import Image from 'next/image'
import Features from '@/components/Features'

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-white/20">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6 bg-transparent">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black text-xs">S</span>
            SupportFlow
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Hey, {user.user_metadata.full_name || user.email}</span>
                <form action={signout}>
                  <button
                    type="submit"
                    className="group flex p-2 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/60 hover:text-red-400"
                    title="Log Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-sm font-medium">
                Log in
              </Link>
            )}
            <Link href={user ? "#" : "/signup"} className="px-5 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-all text-sm font-medium">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-20 flex-1 flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20 pb-10">

          {/* Background Image - Hero Only */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Animated Container - Oversized to prevent gaps */}
            <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] animate-slow-pan">
              <Image
                src="/background1.png"
                alt="Background"
                fill
                className="object-cover object-center opacity-80"
                priority
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black z-10" />
          </div>

          {/* Pill Label */}
          <div className="relative z-20 mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium text-white/80">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Now powering 10,000+ support teams
            </span>
          </div>

          <h1 className="relative z-20 max-w-4xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight animate-fade-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Customer support <br className="hidden md:block" />
            that <span className="italic font-serif font-light text-white/90">feels</span> human.
          </h1>

          <p className="relative z-20 max-w-xl text-lg md:text-xl text-white/60 mb-10 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '0.4s' }}>
            Automate inquiries, organize tickets, and delight customers with an AI-first support platform designed for speed.
          </p>

          <div className="relative z-20 flex flex-col sm:flex-row items-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/signup"
              className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center justify-center hover:bg-gray-200 transition-all hover:scale-105"
            >
              Get started
            </Link>
            <Link
              href="#"
              className="h-12 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium flex items-center justify-center hover:bg-white/10 transition-all"
            >
              Learn more
            </Link>
          </div>
        </section>

        {/* Features Section - Defaults to black bg (from parent) */}
        <Features />

      </main>
    </div>
  )
}
