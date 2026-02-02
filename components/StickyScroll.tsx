'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { Mic, CheckCircle2, Bot, Send, FileText, Clock, Paperclip } from 'lucide-react';

const content = [
    {
        title: "Voice-to-Ticket Transcription",
        description: "Don't let phone calls get lost in the ether. Our AI automatically transcribes support calls and voice notes, converting them into structured tickets instantly.",
        color: "from-pink-500/20 to-purple-500/20",
        Visual: () => (
            <div className="w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 flex items-center justify-center overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

                {/* Card UI */}
                <div className="relative z-10 w-full max-w-sm bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Mic className="text-white w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                            <div className="h-2 w-16 bg-white/10 rounded"></div>
                        </div>
                    </div>

                    {/* Waveform Animation */}
                    <div className="flex items-center justify-center gap-1 h-12 mb-4">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-white/80 rounded-full"
                                animate={{ height: [10, 24, 10] }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                    ease: "easeInOut"
                                }}
                                style={{ height: 10 }}
                            />
                        ))}
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-xs text-white/70 italic">"Customer is reporting a login issue on the mobile app..."</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Smart Agent Copilot",
        description: "Stop wasting time searching for answers. The AI analyzes the ticket and instantly drafts replies, suggests help articles, and prioritizes urgency.",
        color: "from-blue-500/20 to-yellow-500/20",
        Visual: () => (
            <div className="w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-yellow-500 p-8 flex items-center justify-center overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

                {/* Dashboard / Assistant Card */}
                <div className="relative z-10 w-full max-w-sm bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                                <Bot size={18} />
                            </div>
                            <span className="text-sm font-medium text-blue-200">AI Assistant</span>
                        </div>
                        <Paperclip size={16} className="text-white/40" />
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-yellow-400" />
                                <span className="text-xs font-medium text-white/90">Suggested Fix Found</span>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed">Based on the error code, the user needs to clear their cache. Here is the article.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex-1 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                                Apply Fix
                            </button>
                            <button className="py-2 px-3 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Automated Ticket Resolution",
        description: "Handle repetitive queries on autopilot. Our chat bot resolves 40% of L1 tickets instantly without human intervention.",
        color: "from-blue-500 to-purple-400", // Not used in Visual directly, but for reference
        Visual: () => (
            <div className="w-full max-w-[500px] aspect-square rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center overflow-hidden relative shadow-2xl">

                {/* Chat UI */}
                <div className="relative z-10 w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4">

                    {/* User Msg */}
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                            How do I reset my API key?
                        </div>
                    </div>

                    {/* Bot Msg */}
                    <div className="flex justify-start">
                        <div className="bg-white/10 text-white/90 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">
                            You can reset it in Settings `{'>'}` Developers. Would you like a direct link?
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full my-1" />

                    {/* Input Area */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <Bot size={12} className="text-white/50" />
                        </div>
                        <div className="flex-1 h-8 rounded-full bg-white/5 border border-white/5 flex items-center px-3 text-xs text-white/30">
                            Ask anything...
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                            <Send size={14} className="ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function StickyScroll() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative w-full h-[300vh] bg-black">
            {/* 300vh height means we have space for 3 sections to scroll through */}

            <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden">

                {/* Left: Text Content (Overlay on top of visual for mobile, side for desktop) */}
                {/* Actually, standard implementation is 2 columns. */}
                <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-20 relative z-10 pointer-events-none md:pointer-events-auto">
                    {/* We need the text to change based on scroll. 
                Instead of confusing scroll logic, a clearer way for 'Screen' based scroll 
                is to just render the visuals absolutely and switch opacity based on scrollYProgress.
                
                The TEXT needs to scroll naturally. 
            */}
                </div>

                {/* Right: Visuals */}
                <div className="absolute md:relative inset-0 md:inset-auto md:w-1/2 h-full flex items-center justify-center p-6 md:p-12">
                    {content.map((item, index) => {
                        // Determine opacity based on scroll range
                        // 0 - 0.33 : Item 1
                        // 0.33 - 0.66 : Item 2
                        // 0.66 - 1.0 : Item 3
                        const rangeStart = index * 0.33;
                        const rangeEnd = rangeStart + 0.33;

                        // We want smooth crossfade.
                        // fadeIn when progress > start
                        // fadeOut when progress > end

                        // Simple opacity transform
                        return (
                            <VisualCard
                                key={index}
                                Visual={item.Visual}
                                progress={scrollYProgress}
                                range={[rangeStart, rangeEnd]}
                                index={index}
                                total={content.length}
                            />
                        )
                    })}
                </div>
            </div>

            {/* 
          SCROLL CONTENT OVERLAY
          We place the text in absolute positioned divs? No.
          We need a container that is h-[300vh] and has the text blocks spaced out.
          But we layout 'sticky' container to hold visuals.
          
          Correct patterns:
          Container (relative, h-300vh)
            Sticky (top-0, h-screen) -> Holds Visuals
            Divs (absolute/relative) -> The text blocks that you scroll past.
      */}

            <div className="absolute inset-0 w-full md:w-1/2 z-20">
                {content.map((item, i) => (
                    <div key={i} className="h-screen flex items-center justify-center p-8 md:p-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-md"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">{item.title}</h2>
                            <p className="text-lg text-white/60 leading-relaxed">{item.description}</p>
                            <button className="mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium text-white">
                                See how it works
                            </button>
                        </motion.div>
                    </div>
                ))}
            </div>

        </section>
    );
}

const VisualCard = ({ Visual, progress, range, index, total }: { Visual: any, progress: MotionValue<number>, range: [number, number], index: number, total: number }) => {
    // Custom logic to fade in/out
    const opacity = useTransform(progress,
        [range[0], range[0] + 0.1, range[1] - 0.1, range[1]],
        [0, 1, 1, 0]
    );

    // Ensure the last one stays visible? Or just design the ranges perfectly to overlap?
    // Let's modify range for last item to not fade out quickly
    // Actually, [0, 1, 1, 0] is good.

    // If it's the first item, start visible
    // Wait, useTransform requires ordered inputs.

    // Simpler: Just map the specific index range 0-0.33 to opacity 1.
    // We need to handle entry and exit.

    // Range inputs:
    // Start of section -> Fade in
    // End of section -> Fade out

    return (
        <motion.div
            style={{ opacity: opacity }}
            className="absolute inset-0 p-6 md:p-12 flex items-center justify-center"
        >
            <Visual />
        </motion.div>
    )
}
