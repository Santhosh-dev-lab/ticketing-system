'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { login, signup } from '../login/actions'
import { useSearchParams } from 'next/navigation'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(false)
  const message = searchParams.get('message')
  const error = searchParams.get('error')
  const modeParam = searchParams.get('mode')

  useEffect(() => {
    if (modeParam === 'login') {
      setIsLogin(true)
    }
  }, [modeParam])

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-[#020617] text-white selection:bg-white/20 relative overflow-hidden">

      {/* Global Background Glow */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Left Column: Form */}
      <div className="flex items-center justify-center py-12 px-8 sm:px-12 lg:px-16 z-10 w-full">
        <div className="mx-auto grid w-full max-w-[420px] gap-7">
          <div className="grid gap-2 text-left mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-gray-400 text-base">
              {isLogin ? 'Enter your details to sign in.' : 'Create an account to start managing your workflow.'}
            </p>
          </div>

          <form action={isLogin ? login : signup} className="grid gap-5">
            {/* Social Buttons */}
            <div className="grid gap-4">
              <button type="button" disabled className="group flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium hover:bg-white/10 transition-all duration-200 text-white/80 cursor-not-allowed">
                <svg className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 8.08-3.36 2.107-2.187 2.72-5.467 2.72-8.32 0-.6-.053-1.147-.133-1.4h-10.66z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-[#050A15] px-3 text-gray-500">Or {isLogin ? 'sign in' : 'register'} with email</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div className="grid gap-2 animate-fade-up">
                  <label htmlFor="fullName" className="text-xs font-medium text-gray-400 uppercase tracking-wide ml-1">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Jordan Smith"
                    required={!isLogin}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <label htmlFor="email" className="text-xs font-medium text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-medium text-gray-400 uppercase tracking-wide ml-1">Password</label>
                  {isLogin && (
                    <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-white/90 px-4 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:bg-white hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {message && (
              <p className="mt-2 p-3 text-center bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-lg text-xs animate-fade-up">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 p-3 text-center bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-xs animate-fade-up">
                {error}
              </p>
            )}
          </form>

          <div className="text-center text-sm text-gray-500 mt-2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden lg:flex relative items-center justify-center p-0 z-10 overflow-visible">

        {/* Tilted Image Container - Floating freely */}
        <div className="relative w-full h-[120%] flex items-center justify-center transition-transform duration-700 ease-out group hover:scale-[1.02] translate-x-12" style={{ perspective: '1000px' }}>
          <div className="relative" style={{ transform: 'rotateY(-10deg) rotateX(5deg) scale(1.0)', transformStyle: 'preserve-3d' }}>
            <img
              src="/dashboard.png"
              alt="Dashboard Preview"
              className="w-auto h-[100%] max-w-[125%] object-contain"
              style={{
                boxShadow: '30px 30px 60px rgba(0,0,0,0.5)'
              }}
            />

            {/* INTERACTIVE POPUP MODAL 1 (TC-0001) */}
            <div className="absolute top-[30%] left-[25%] bg-[#1A1F2E] border border-white/10 rounded-xl p-4 w-[260px] shadow-2xl origin-top-left animate-modal-1 z-10 flex flex-col gap-3" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-400 font-bold">BH</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white">Billy Harper</span>
                    <span className="text-[8px] text-gray-500">Customer</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400">#TC-0001</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[9px] text-gray-400">Subject</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 rounded">Low</span>
                  </div>
                  <p className="text-[10px] text-white/90 font-medium">System Login Failure</p>
                </div>
                <div className="h-7 w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mt-1 shadow-lg shadow-emerald-900/10 animate-btn-accept">
                  <span className="text-[10px] font-bold">Accept Ticket</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE POPUP MODAL 2 (TC-0003) - Moved UP (Gap reduced) */}
            <div className="absolute top-[38%] left-[25%] bg-[#1A1F2E] border border-white/10 rounded-xl p-4 w-[260px] shadow-2xl origin-top-left animate-modal-2 z-10 flex flex-col gap-3" style={{ transform: 'translateZ(50px)' }}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">TM</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white">Tiago Motta</span>
                    <span className="text-[8px] text-gray-500">Customer</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400">#TC-0003</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[9px] text-gray-400">Subject</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 rounded">Low</span>
                  </div>
                  <p className="text-[10px] text-white/90 font-medium">Request for Additional Storage</p>
                </div>
                <div className="h-7 w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mt-1 shadow-lg shadow-emerald-900/10 animate-[btn-press-accept_3s_infinite_linear]">
                  <span className="text-[10px] font-bold">Accept Ticket</span>
                </div>
              </div>
            </div>

            {/* Simulated Cursor (Animation: animate-cursor-complex) */}
            <div className="absolute top-[35%] left-[32%] animate-cursor-complex z-30 pointer-events-none drop-shadow-xl" style={{ transform: 'translateZ(60px)' }}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5L25 20L17 21L21 28L18 30L14 23L9 28V5Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>

            {/* RIPPLES (Synced to 20s loop) */}
            {/* 1. Click Ticket 1 (12% of 20s = 2.4s) */}
            <div className="absolute top-[calc(35%-40px)] left-[calc(32%-20px)] w-6 h-6 rounded-full bg-white/60 animate-[ripple-fire_20s_infinite_linear]" style={{ animationDelay: '2.4s' }} />

            {/* 2. Click Accept 1 (30% of 20s = 6s) */}
            <div className="absolute top-[calc(35%+60px)] left-[calc(32%+60px)] w-6 h-6 rounded-full bg-white/60 animate-[ripple-fire_20s_infinite_linear]" style={{ animationDelay: '6s' }} />

            {/* 3. Click Ticket 2 (52% of 20s = 10.4s) */}
            <div className="absolute top-[calc(35%+60px)] left-[calc(32%-15px)] w-6 h-6 rounded-full bg-white/60 animate-[ripple-fire_20s_infinite_linear]" style={{ animationDelay: '10.4s' }} />

            {/* 4. Click Accept 2 (70% of 20s = 14s) */}
            <div className="absolute top-[calc(35%+160px)] left-[calc(32%+60px)] w-6 h-6 rounded-full bg-white/60 animate-[ripple-fire_20s_infinite_linear]" style={{ animationDelay: '14s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
