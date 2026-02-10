'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Ticket } from '../../components/ticket-list' // Reusing type
// Extend Ticket Type to include customer
interface AgentTicket extends Ticket {
    customer?: {
        full_name: string
        email: string
    }
    assigned_agent?: {
        full_name: string
        email: string
    }
}

export default function TicketFeed({ initialTickets = [] }: { initialTickets: AgentTicket[] }) {
    const [tickets, setTickets] = useState<AgentTicket[]>(initialTickets)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('agent-realtime-feed')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tickets' },
                (payload) => {
                    // In a real production app, we'd need to fetch the relation (customer) 
                    // because the payload only has the raw ticket data.
                    // For now, we'll just optimistically update what we can or refetch.
                    console.log('Update received', payload)
                    // Simple reload for now to get relations
                    // router.refresh() 
                    // Or just handle inserts purely if they contain enough info? 
                    // Let's stick to basics: rely on page refresh or simple state update for raw fields
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [supabase])

    if (tickets.length === 0) {
        return (
            <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                </div>
                <h3 className="text-white font-medium text-lg">No tickets found</h3>
                <p className="text-white/40 text-sm mt-1 max-w-xs">Good job! You've cleared the queue. Waiting for new incoming requests...</p>
            </div>
        )
    }

    return (
        <div className="bg-[#1A1D24] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#15181E] border-b border-white/5 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                        <tr>
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Customer</th>
                            <th className="py-4 px-6">Subject</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Priority</th>
                            <th className="py-4 px-6">Assignee</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tickets.map((ticket) => (
                            <TicketRow key={ticket.id} ticket={ticket} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

import { claimTicket } from '../actions'
import { useRouter } from 'next/navigation'

function TicketRow({ ticket }: { ticket: AgentTicket }) {
    const [isPending, startTransition] = useState(false)
    const router = useRouter()

    const handleClaim = async () => {
        startTransition(true)
        const result = await claimTicket(ticket.id)
        if (result.error) {
            alert(result.error) // Simple error handling for now
        } else {
            // Success - component might re-render from server action revalidatePath, 
            // but we can also do local state update if we moved state up or just let revalidate handle it.
            // For this simpler version, we rely on revalidatePath.
        }
        startTransition(false)
    }

    return (
        <tr className="group hover:bg-white/[0.02] transition-all duration-200">
            <td className="py-4 px-6 font-mono text-xs text-blue-400/80 group-hover:text-blue-400">
                #{ticket.readable_id || ticket.id.toString().slice(0, 4)}
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {ticket.customer?.full_name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                            {ticket.customer?.full_name || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-white/40">{ticket.customer?.email}</span>
                    </div>
                </div>
            </td>
            <td className="py-4 px-6 max-w-xs">
                <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate block">
                    {ticket.title}
                </span>
            </td>
            <td className="py-4 px-6">
                {/* Neon Badges */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wide transition-all duration-300
                    ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]' :
                            'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-blue-500 animate-pulse' : ticket.status === 'resolved' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                    {ticket.status}
                </span>
            </td>
            <td className="py-4 px-6">
                {ticket.priority === 'urgent' ? (
                    <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                        Urgent
                    </span>
                ) : (
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${ticket.priority === 'high' ? 'text-orange-400' : 'text-white/40'}`}>
                        {ticket.priority}
                    </span>
                )}
            </td>
            <td className="py-4 px-6">
                {ticket.assigned_agent ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30">
                            {ticket.assigned_agent.full_name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-xs text-indigo-300 font-medium">{ticket.assigned_agent.full_name}</span>
                    </div>
                ) : (
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Unassigned</span>
                )}
            </td>
            <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" title="Peek Ticket">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    {!ticket.assigned_agent && (
                        <button
                            onClick={handleClaim}
                            disabled={isPending}
                            className={`px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-md transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-600/20 active:scale-95 flex items-center gap-1 ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            <span>{isPending ? 'Claiming...' : 'Claim'}</span>
                            {!isPending && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            )}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}
