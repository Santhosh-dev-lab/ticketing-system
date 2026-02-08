'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type Ticket = {
    id: number
    title: string
    description: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    department: string
    created_at: string
    customer_id: string
    readable_id: number
    assigned_agent?: {
        full_name: string
        email: string
    }
}

export default function TicketList({ initialTickets = [] }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // 1. Subscribe to the 'tickets' table
        const channel = supabase
            .channel('realtime-tickets')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'tickets',
                },
                (payload) => {
                    console.log('Realtime update:', payload)

                    if (payload.eventType === 'INSERT') {
                        setTickets((prev) => [payload.new as Ticket, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setTickets((prev) =>
                            prev.map((t) => (t.id === payload.new.id ? (payload.new as Ticket) : t))
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setTickets((prev) => prev.filter((t) => t.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Filter Logic
    const filteredTickets = tickets.filter((t) => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'open' ? (t.status === 'open' || t.status === 'in_progress') :
                    t.status === filter

        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toString().includes(search)

        return matchesFilter && matchesSearch
    })

    // Stats Calculation
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'open').length
    const inProgress = tickets.filter(t => t.status === 'in_progress').length
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    return (
        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            {/* Toolbar */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white tracking-tight">All Tickets</h2>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        Create Ticket
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-[#15181E] border-b border-white/5 flex items-center gap-4 overflow-x-auto">
                {/* Search */}
                <div className="relative group flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search ticket..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    <svg className="w-4 h-4 text-white/30 absolute left-3 top-2.5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                {/* Filter Dropdowns (Visual Only for now, mapped to existing filter logic) */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#0B0E14] border border-white/10 text-white/70 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                    <option value="all">Status: All</option>
                    <option value="open">Status: Open</option>
                    <option value="resolved">Status: Resolved</option>
                </select>

                <div className="bg-[#0B0E14] border border-white/10 text-white/70 text-xs font-medium rounded-lg px-3 py-2 cursor-pointer flex items-center gap-2 hover:border-white/20 transition-all">
                    <span>Priority</span>
                    <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                <div className="bg-[#0B0E14] border border-white/10 text-white/70 text-xs font-medium rounded-lg px-3 py-2 cursor-pointer flex items-center gap-2 hover:border-white/20 transition-all">
                    <span>Assigned To</span>
                    <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <button className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#15181E] border-b border-white/5">
                        <tr>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Ticket ID</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Subject</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Category</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Priority</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Assigned To</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-[11px] font-bold text-white/40 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                <td className="py-4 px-6">
                                    <span className="text-xs font-bold text-white/70">#{ticket.readable_id || ticket.id}</span>
                                </td>
                                <td className="py-4 px-6 max-w-xs">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mb-0.5">{ticket.title}</span>
                                        <span className="text-[11px] text-white/40 truncate">{ticket.description}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-xs font-medium text-white/60">{ticket.department || 'General'}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <StatusBadge status={ticket.status} />
                                </td>
                                <td className="py-4 px-6">
                                    <PriorityBadge priority={ticket.priority} />
                                </td>
                                <td className="py-4 px-6">
                                    {ticket.assigned_agent ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#1A1D24]">
                                                {ticket.assigned_agent.full_name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <span className="text-xs font-medium text-white/80">{ticket.assigned_agent.full_name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            </div>
                                            <span className="text-xs font-medium text-white/30 italic">Unassigned</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-xs font-medium text-white/60">
                                        {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white/40">
                                        <button className="p-1.5 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        </button>
                                        <button className="p-1.5 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        </button>
                                        <button className="p-1.5 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white/50 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Previous
                </button>

                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((page) => (
                        <button key={page} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${page === 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                            {page}
                        </button>
                    ))}
                    <span className="text-white/30 text-xs">...</span>
                    <button className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        8
                    </button>
                    <button className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        9
                    </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white/50 hover:text-white transition-colors">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        open: "bg-[#0d1424] text-blue-400 border-blue-500/20",
        in_progress: "bg-[#1a120b] text-orange-400 border-orange-500/20",
        resolved: "bg-[#0b1a15] text-emerald-400 border-emerald-500/20",
        closed: "bg-[#111] text-gray-400 border-gray-500/20",
    }
    const dots = {
        open: "bg-blue-500 shadow-[0_0_10px_-2px_rgba(59,130,246,0.5)]",
        in_progress: "bg-orange-500 shadow-[0_0_10px_-2px_rgba(249,115,22,0.5)]",
        resolved: "bg-emerald-500 shadow-[0_0_10px_-2px_rgba(16,185,129,0.5)]",
        closed: "bg-gray-500",
    }
    const labels = {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
    }

    return (
        <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.closed}`}>
            {labels[status as keyof typeof labels] || status}
        </span>
    )
}

function PriorityBadge({ priority }: { priority: string }) {
    const styles = {
        urgent: "bg-red-500/10 text-red-400 border border-red-500/20",
        high: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    }

    return (
        <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[priority as keyof typeof styles] || styles.low}`}>
            {priority}
        </span>
    )
}
