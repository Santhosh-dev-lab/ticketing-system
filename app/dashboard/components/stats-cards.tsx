import { Ticket } from './ticket-list'

export default function StatsCards({ tickets }: { tickets: Ticket[] }) {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'open').length
    const inProgress = tickets.filter(t => t.status === 'in_progress').length
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card label="Total Tickets" value={total} color="bg-white/5 border-white/10 text-white" />
            <Card label="Open / Pending" value={open} color="bg-blue-500/10 border-blue-500/20 text-blue-400" />
            <Card label="In Progress" value={inProgress} color="bg-orange-500/10 border-orange-500/20 text-orange-400" />
            <Card label="Resolved" value={resolved} color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
        </div>
    )
}

function Card({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className={`p-4 rounded-xl border ${color} flex flex-col`}>
            <span className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</span>
            <span className="text-3xl font-bold mt-1">{value}</span>
        </div>
    )
}
