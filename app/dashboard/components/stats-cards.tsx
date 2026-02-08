import { Ticket } from './ticket-list'

export default function StatsCards({ tickets }: { tickets: Ticket[] }) {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'open').length
    const inProgress = tickets.filter(t => t.status === 'in_progress').length
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card label="Total Tickets" value={total} className="bg-[#0A0C10] border-white/5 text-white" />
            <Card label="Open / Pending" value={open} className="bg-[#0d1424] border-blue-500/10 text-blue-400" />
            <Card label="In Progress" value={inProgress} className="bg-[#1a120b] border-orange-500/10 text-orange-400" />
            <Card label="Resolved" value={resolved} className="bg-[#0b1a15] border-emerald-500/10 text-emerald-400" />
        </div>
    )
}

function Card({ label, value, className }: { label: string, value: number, className: string }) {
    return (
        <div className={`p-6 rounded-2xl border ${className} flex flex-col justify-between h-32`}>
            <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">{label}</span>
            <span className="text-4xl font-bold tracking-tight mt-2">{value}</span>
        </div>
    )
}
