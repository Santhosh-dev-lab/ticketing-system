import { createClient } from '@/utils/supabase/server'
import TicketList from './components/ticket-list'
import Header from './components/header'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('tickets')
        .select(`
            *,
            assigned_agent:assigned_to (
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false })
    return (
        <>
            <Header title="All Tickets" />
            <main className="p-8">
                <TicketList initialTickets={tickets || []} />
            </main>
        </>
    )
}
