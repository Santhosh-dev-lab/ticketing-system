'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
    value: string
    label: string
}

interface CustomSelectProps {
    label: string
    name: string
    options: Option[]
    placeholder?: string
    required?: boolean
}

export default function CustomSelect({ label, name, options, placeholder = 'Select an option', required = false }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<Option | null>(options[0] || null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: Option) => {
        setSelectedOption(option)
        setIsOpen(false)
    }

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">
                {label}
            </label>
            <div className="relative">
                {/* Hidden Input for Form Submission */}
                <input
                    type="hidden"
                    name={name}
                    value={selectedOption?.value || ''}
                    required={required}
                />

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-[#0B0E14] border border-white/10 rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner ${isOpen ? 'border-blue-500/50 ring-4 ring-blue-500/10' : 'hover:border-white/20'}`}
                >
                    <span className={selectedOption ? 'text-white' : 'text-white/20'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.1, ease: 'easeOut' }}
                            className="absolute z-50 w-full mt-2 bg-[#1A1D24] border border-white/10 rounded-2xl shadow-xl overflow-hidden py-1"
                        >
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className="w-full px-4 py-2.5 text-sm text-left text-white/70 hover:bg-white/5 hover:text-white flex items-center justify-between transition-colors"
                                >
                                    <span>{option.label}</span>
                                    {selectedOption?.value === option.value && (
                                        <Check className="w-3.5 h-3.5 text-blue-500" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
