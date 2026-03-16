'use client'

import { useState } from 'react'
import { updateExpertise } from '../expertise-action'

export default function ExpertiseSettings({ initialExpertise }: { initialExpertise: string }) {
    const [expertise, setExpertise] = useState(initialExpertise)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        const result = await updateExpertise(expertise)
        setIsSaving(false)

        if (result.error) {
            alert('Failed to update expertise: ' + result.error)
        } else {
            alert('Expertise updated successfully!')
        }
    }

    return (
        <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Expertise & Skills</h3>
                <p className="text-xs text-white/40">Describe your technical skills and domain knowledge. This helps the AI assign the right tickets to you.</p>
            </div>
            
            <textarea
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g., React, Node.js, Database Optimization, Billing APIs..."
                className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            />

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
            >
                {isSaving ? 'Saving...' : 'Save Capabilities'}
            </button>
        </div>
    )
}
