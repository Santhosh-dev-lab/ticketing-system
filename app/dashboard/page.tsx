import { createClient } from '@/utils/supabase/server'
import TicketList from './components/ticket-list'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="h-[calc(100vh-4rem)]">
            <TicketList initialTickets={tickets || []} />
        </div>
    )
}
