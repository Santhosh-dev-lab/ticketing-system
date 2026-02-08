'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'

function AuthContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const error = searchParams.get('error')

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-black to-[#020617] text-white selection:bg-white/20 relative overflow-hidden">

            {/* Global Background Glow */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

            {/* Left Column: Form */}
            <div className="flex items-center justify-center py-12 px-8 sm:px-12 lg:px-16 z-10 w-full">
                <div className="mx-auto grid w-full max-w-[420px] gap-7">
                    <div className="grid gap-2 text-left mb-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
                            Client Portal
                        </h1>
                        <p className="text-gray-400 text-base">
                            Enter your credentials to access the support dashboard.
                        </p>
                    </div>

                    <form action={login} className="grid gap-5">


                        <div className="space-y-4">
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
                                    <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                        Forgot password?
                                    </Link>
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
                            Sign In
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

                </div>
            </div>

            {/* Right Column: Image */}
            <div className="hidden lg:flex relative items-center justify-center p-0 z-10 overflow-visible">

                {/* Tilted Image Container - Floating freely */}
                <div className="relative w-full h-[120%] flex items-center justify-center transition-transform duration-700 ease-out group hover:scale-[1.02] translate-x-12" style={{ perspective: '1000px' }}>
                    <div className="relative" style={{ transform: 'rotateY(-10deg) rotateX(5deg) scale(1.0)', transformStyle: 'preserve-3d' }}>
                        <img
                            src="/dashboard-preview.png"
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

                        {/* Simulated Cursor (Animation: animate-cursor-complex) */}
                        <div className="absolute top-[35%] left-[32%] animate-cursor-complex z-30 pointer-events-none drop-shadow-xl" style={{ transform: 'translateZ(60px)' }}>
                            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 5L25 20L17 21L21 28L18 30L14 23L9 28V5Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>}>
            <AuthContent />
        </Suspense>
    )
}
