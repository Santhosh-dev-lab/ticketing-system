'use client'

import { useActionState } from 'react'
import { createTicket } from '../actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

import TicketAnimation from '@/public/ticket.json'
import LottieAnimation from '@/components/LottieAnimation'
import CustomSelect from '@/components/CustomSelect'

export default function NewTicketPage() {
    const [state, formAction, isPending] = useActionState(createTicket, initialState)

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col justify-center max-w-6xl mx-auto relative">
            {/* Global Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.12] pointer-events-none overflow-hidden">
                <svg className="absolute w-full h-full" width="100%" height="100%">
                    <defs>
                        <g id="ticket-doodle">
                            {/* Ticket Body */}
                            <path d="M20 40 H80 A5 5 0 0 1 85 45 V55 A5 5 0 0 0 85 65 V75 A5 5 0 0 1 80 80 H20 A5 5 0 0 1 15 75 V65 A5 5 0 0 0 15 55 V45 A5 5 0 0 1 20 40 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
                            {/* Perforation Line */}
                            <path d="M35 40 V80" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-white" />
                            {/* Content Lines */}
                            <path d="M45 50 H75 M45 60 H70 M45 70 H65" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
                            {/* Gear Icon - Top Right Overlay */}
                            <g transform="translate(75, 30) scale(0.6)">
                                <path d="M15 10 A5 5 0 0 0 10 15 L8 15 L7 12 A10 10 0 0 0 3 14 L4 17 L2 20 L0 18 A10 10 0 0 0 0 22 L3 24 L3 27 L0 29 A10 10 0 0 0 2 33 L5 31 L8 34 L8 37 A5 5 0 0 0 10 42 L20 42 A5 5 0 0 0 22 37 L22 34 L25 31 L28 33 A10 10 0 0 0 30 29 L27 27 L27 24 L30 22 A10 10 0 0 0 28 18 L26 20 L24 17 L25 14 A10 10 0 0 0 21 12 L20 15 L18 15 A5 5 0 0 0 15 10 Z" fill="#1A1D24" stroke="currentColor" strokeWidth="2" className="text-white" />
                                <circle cx="15" cy="26" r="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" />
                            </g>
                        </g>
                    </defs>

                    <pattern id="global-ticket-pattern" x="0" y="0" width="320" height="320" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
                        <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 -320" dur="20s" repeatCount="indefinite" />

                        {/* Randomly placed tickets - Moved away from edges to prevent clipping */}
                        <use href="#ticket-doodle" transform="translate(100, 40) rotate(-15 50 60)" />
                        <use href="#ticket-doodle" transform="translate(250, 80) rotate(10 50 60)" />
                        <use href="#ticket-doodle" transform="translate(50, 180) rotate(20 50 60)" />
                        <use href="#ticket-doodle" transform="translate(200, 240) rotate(-5 50 60)" />
                        <use href="#ticket-doodle" transform="translate(120, 300) rotate(5 50 60)" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#global-ticket-pattern)" />
                </svg>
                {/* Radial Fade for seamless blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0B0E14]/40 to-[#0B0E14]"></div>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between px-2 shrink-0 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Submit a Support Ticket</h1>
                    <p className="text-white/40 text-xs font-medium">We represent the best of the company. Let us know how we can help.</p>
                </div>
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span className="text-xs font-medium">Back</span>
                </Link>
            </div>

            {/* Unified Card */}
            <div className="bg-[#1A1D24] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 grow max-h-[600px]">

                {/* Left Column: Form */}
                <div className="p-8 relative z-10 flex flex-col justify-center bg-[#1A1D24] h-full overflow-hidden">
                    {/* Background Doodle Pattern Removed */}
                    {/* Gradient Fade Overlay */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1A1D24] via-[#1A1D24]/40 to-transparent pointer-events-none"></div>

                    <form action={formAction} className="space-y-6 relative z-10">
                        {state?.error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-red-400 text-xs font-medium">{state.error}</span>
                            </div>
                        )}

                        <div className="grid gap-5">
                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label htmlFor="title" className="block text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">
                                    Subject <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    placeholder="Brief summary of the issue"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Row: Department & Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-20 relative">
                                <CustomSelect
                                    label="Department"
                                    name="department"
                                    options={[
                                        { value: 'General', label: 'General Inquiry' },
                                        { value: 'Technical Support', label: 'Technical Support' },
                                        { value: 'Billing', label: 'Billing & Account' },
                                        { value: 'Feature Request', label: 'Feature Request' },
                                    ]}
                                />

                                <CustomSelect
                                    label="Priority Level"
                                    name="priority"
                                    options={[
                                        { value: 'low', label: 'Low - General Question' },
                                        { value: 'medium', label: 'Medium - Standard Issue' },
                                        { value: 'high', label: 'High - Functionality Impaired' },
                                        { value: 'urgent', label: 'Urgent - Critical Blocker' },
                                    ]}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 z-0">
                                <label htmlFor="description" className="block text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    required
                                    placeholder="Please provide specific details about your request..."
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed shadow-inner"
                                />
                                <p className="text-[10px] text-white/30 text-right mr-1">Markdown supported</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-end gap-3 z-0 relative">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Ticket</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Animation & Branding */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-[#15181E] relative overflow-hidden border-l border-white/5 h-full">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#15181E] via-[#0F1116] to-[#15181E] z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center w-full px-10">
                        {/* Animation */}
                        <div className="w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-700 ease-out">
                            <LottieAnimation animationData={TicketAnimation} />
                        </div>

                        {/* Classic Typography Section */}
                        <div className="mt-2 text-center">
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">TicketFlow Enterprise</span>
                            </div>

                            <h3 className="text-2xl font-serif tracking-tight text-white mb-3">Empowering Your Workflow</h3>

                            <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed font-light">
                                Experience seamless issue tracking designed to keep your business running with precision and speed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
