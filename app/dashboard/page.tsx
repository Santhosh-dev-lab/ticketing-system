import { createClient } from '@/utils/supabase/server'
import TicketList from './components/ticket-list'
import StatsCards from './components/stats-cards'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col p-6 max-w-[1600px] mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
                <p className="text-white/60">Overview of your support requests and status.</p>
            </div>

            <StatsCards tickets={tickets || []} />

            <div className="flex-1 min-h-0">
                <TicketList initialTickets={tickets || []} />
            </div>
        </div>
    )
}
