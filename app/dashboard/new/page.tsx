import { createTicket } from '../actions'

export default function NewTicketPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white">Create New Ticket</h1>
                <p className="text-white/60 text-sm mt-1">Submit a new support request and we'll get back to you.</p>
            </div>

            <form action={createTicket} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-white/80">Subject</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="Brief summary of the issue"
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="department" className="text-sm font-medium text-white/80">Department</label>
                        <select
                            name="department"
                            id="department"
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all [&>option]:bg-[#0F172A]"
                        >
                            <option value="General">General</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Billing">Billing</option>
                            <option value="Feature Request">Feature Request</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="priority" className="text-sm font-medium text-white/80">Priority</label>
                        <select
                            name="priority"
                            id="priority"
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all [&>option]:bg-[#0F172A]"
                        >
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-white/80">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={6}
                        required
                        placeholder="Describe the issue in detail..."
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                    />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="px-5 py-2.5 rounded-lg border border-white/10 bg-transparent text-sm font-medium text-white hover:bg-white/5 transition-colors"
                    // Add back navigation logic if cleaner interaction is needed
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all"
                    >
                        Submit Ticket
                    </button>
                </div>
            </form>
        </div>
    )
}
