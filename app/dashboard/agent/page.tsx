import { createClient } from '@/utils/supabase/server'
import Header from '../components/header'
import TicketFeed from './components/TicketFeed'
import { Ticket } from '../components/ticket-list'
import ExpertiseSettings from './components/ExpertiseSettings'

export const dynamic = 'force-dynamic'

export default async function AgentDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch agent profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('expertise, department')
        .eq('id', user?.id)
        .single()

    // Fetch ALL tickets for agents
    const { data: tickets } = await supabase
        .from('tickets')
        .select(`
            *,
            assigned_agent:assigned_to (
                full_name,
                email
            ),
            customer:customer_id (
                full_name,
                email
            )
        `)
        .order('priority', { ascending: false }) // Urgent first? specific order logic might be needed
        .order('created_at', { ascending: false })

    // Simple stats calculation
    const totalTickets = tickets?.length || 0
    const openTickets = tickets?.filter(t => t.status === 'open').length || 0
    const urgentTickets = tickets?.filter(t => t.priority === 'urgent' && t.status !== 'closed').length || 0

    return (
        <div className="flex flex-col gap-6">
            <Header title="Mission Control" />

            <main className="px-8 pb-8 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Tickets" value={totalTickets} icon="inbox" />
                    <StatCard label="Open Issues" value={openTickets} icon="alert" color="text-blue-400" />
                    <StatCard label="Urgent" value={urgentTickets} icon="fire" color="text-red-400" />
                    <StatCard label="Avg Response" value="12m" icon="clock" color="text-emerald-400" />
                </div>

                {/* Main Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Ticket Feed
                        </h2>
                        <TicketFeed initialTickets={(tickets as any[]) || []} />
                    </div>

                    <div className="flex flex-col gap-6">
                        <ExpertiseSettings 
                            initialExpertise={(profile?.expertise as string) || ''} 
                            initialDepartment={(profile?.department as string) || 'General'}
                        />
                        
                        {/* Quick Stats or Tips could go here */}
                        <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">AI Routing Tip</h3>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Be specific! Instead of just "Backend", use "Node.js, Postgres optimization, Redis caching". This improves your matching accuracy.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ label, value, icon, color = "text-white" }: { label: string, value: string | number, icon: string, color?: string }) {
    return (
        <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 transition-all group">
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
                <span className={`text-2xl font-bold ${color} font-mono`}>{value}</span>
            </div>
            <div className={`p-3 rounded-lg bg-white/5 ${color} opacity-80 group-hover:scale-110 transition-transform`}>
                {/* Icons based on string - kept simple for now */}
                {icon === 'inbox' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>}
                {icon === 'alert' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                {icon === 'fire' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>}
                {icon === 'clock' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            </div>
        </div>
    )
}
