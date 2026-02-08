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

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a] rounded-xl border border-white/5 shadow-2xl">
            {/* Header / Controls */}
            <div className="p-6 border-b border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">All Tickets</h2>
                        <p className="text-xs text-white/40 mt-1">Manage and track your support requests.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard/new" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                            New Ticket
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg self-start">
                        {['all', 'open', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === status ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                    } capitalize`}
                            >
                                {status === 'all' ? 'All Tickets' : status}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#0F1219] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-all w-full md:w-64"
                        />
                        <svg className="w-4 h-4 text-white/30 absolute left-3 top-2.5 group-focus-within:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>

            {/* Canvas / Table Area */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0a0a0a] sticky top-0 z-10">
                        <tr>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">Ticket ID</th>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">Subject</th>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">Status</th>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">Priority</th>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">Department</th>
                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5 text-right">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <p className="text-white/30 text-xs">No tickets found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-all cursor-pointer">
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono font-medium text-white/70 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                            #{ticket.readable_id || ticket.id}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors mb-1">{ticket.title}</span>
                                            <span className="text-[11px] text-white/40 line-clamp-1 max-w-[300px]">{ticket.description}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={ticket.status} />
                                    </td>
                                    <td className="py-4 px-6">
                                        <PriorityBadge priority={ticket.priority} />
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">{ticket.department}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right text-xs text-white/30 font-mono">
                                        {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        closed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    }
    const labels = {
        open: "Open",
        in_progress: "In Progress",
        resolved: "Resolved",
        closed: "Closed",
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${styles[status as keyof typeof styles] || styles.closed}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'open' ? 'bg-blue-400' : status === 'in_progress' ? 'bg-orange-400' : status === 'resolved' ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
            {labels[status as keyof typeof labels] || status}
        </span>
    )
}

function PriorityBadge({ priority }: { priority: string }) {
    const icons = {
        urgent: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        high: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
        medium: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>,
        low: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
    }
    const styles = {
        urgent: "text-red-400 bg-red-500/10 border-red-500/20",
        high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border ${styles[priority as keyof typeof styles] || styles.low}`}>
            {icons[priority as keyof typeof styles]}
            <span className="uppercase tracking-wide">{priority}</span>
        </span>
    )
}
