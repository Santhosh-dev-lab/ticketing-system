'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef } from 'react';

const paragraph1 = "Turn every customer signal 2 voice, chat, or email into a structured, actionable ticket. No data lost, no context missing.";
const paragraph2 = "Empower your agents with a smart copilot. AI that drafts answers, prioritizes urgency, and automates resolution instantly.";
const paragraph3 = "Support that scales with your ambition. Deliver human-quality care at machine speed, resolving issues before they escalate.";

export default function MissionStatement() {
    const container = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "end 0.8"] // adjust offsets to control when it happens
    });

    return (
        <section
            ref={container}
            className="max-w-2xl mx-auto px-6 py-32 text-white/50"
        >
            <div className="flex flex-col gap-12 text-xl md:text-3xl font-semibold leading-tight">
                <Paragraph text={paragraph1} progress={scrollYProgress} range={[0, 0.33]} />
                <Paragraph text={paragraph2} progress={scrollYProgress} range={[0.33, 0.66]} />
                <Paragraph text={paragraph3} progress={scrollYProgress} range={[0.66, 1]} />
            </div>
        </section>
    );
}

const Paragraph = ({ text, progress, range }: { text: string, progress: MotionValue<number>, range: [number, number] }) => {
    const words = text.split(" ");
    const amount = range[1] - range[0];
    const step = amount / words.length;

    return (
        <p className="flex flex-wrap gap-x-2.5">
            {words.map((word, i) => {
                const start = range[0] + (i * step);
                const end = range[0] + ((i + 1) * step);
                return <Word key={i} range={[start, end]} progress={progress}>{word}</Word>
            })}
        </p>
    )
}

const Word = ({ children, range, progress }: { children: string, range: [number, number], progress: MotionValue<number> }) => {
    const opacity = useTransform(progress, range, [0.1, 1]); // fades from 0.1 to 1 opacity

    return (
        <span className="relative">
            <span className="absolute opacity-10">{children}</span> {/* Shadow copy to keep layout size fixed if we mess with opacity? No, opacity doesn't change layout. But just in case we want a base dimmed layer. Actually, just using opacity on the main word is fine, but double layering helps smooth edges sometimes. Let's strictly follow the design: "text should get colour". Usually means default is grey, lights up to white. */}
            {/* Simpler approach: Just one span with transform opacity. */}
            {/* Wait, 'text-white/50' on parent sets default. 
          But I want strict control. 
          Let's use a motion span. */}
            <motion.span style={{ opacity: opacity }} className="text-white">
                {children}
            </motion.span>
        </span>
    )
}
