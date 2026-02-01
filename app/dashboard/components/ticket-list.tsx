'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Ticket = {
    id: number
    title: string
    description: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    department: string
    created_at: string
    customer_id: string
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
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header / Controls */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Support Request <span className="text-white/40 text-lg font-normal ml-2">...</span></h1>
                    <div className="flex gap-2">
                        <Link href="/dashboard/new" className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                            Add
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10 text-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`pb-3 font-medium transition-colors relative ${filter === 'all' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        All Type
                        {filter === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`pb-3 font-medium transition-colors relative ${filter === 'open' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        Open / Active
                        {filter === 'open' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`pb-3 font-medium transition-colors relative ${filter === 'resolved' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                    >
                        Resolved
                        {filter === 'resolved' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></span>}
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 py-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#0F1219] border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-64"
                        />
                        <svg className="w-4 h-4 text-white/30 absolute left-3 top-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <div className="h-6 w-px bg-white/10 mx-1"></div>

                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0F1219] text-xs text-white/70 hover:text-white transition-colors">
                        Date Submitted <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0F1219] text-xs text-white/70 hover:text-white transition-colors">
                        Type <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0F1219] text-xs text-white/70 hover:text-white transition-colors">
                        Priority <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>

            {/* Canvas / Table Area */}
            <div className="flex-1 overflow-auto bg-[#0F1219] border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5">Ticket ID</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5">Subject</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5">Priority</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5">Department</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5">Status</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5 text-right">Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-white/30 text-xs">
                                    No tickets found.
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                    <td className="py-3 px-4 text-xs font-mono text-white/60 group-hover:text-white/80">
                                        TC-{ticket.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors block mb-0.5">{ticket.title}</span>
                                        <span className="text-[10px] text-white/40 line-clamp-1">{ticket.description}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${ticket.priority === 'urgent' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                ticket.priority === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                    ticket.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'urgent' ? 'bg-red-500' :
                                                    ticket.priority === 'high' ? 'bg-orange-500' :
                                                        ticket.priority === 'medium' ? 'bg-yellow-500' :
                                                            'bg-emerald-500'
                                                }`}></span>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-xs text-white/60">{ticket.department}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${ticket.status === 'open' ? 'bg-blue-500/20 text-blue-300' :
                                                ticket.status === 'in_progress' ? 'bg-orange-500/20 text-orange-300' :
                                                    ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right text-xs text-white/40 font-mono">
                                        {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
