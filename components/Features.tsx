'use client'

import React, { useRef } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import {
    Mail,
    BarChart3,
    MessageCircle,
    Zap,
    Puzzle,
    Book,
    Facebook,
    Twitter,
    Linkedin,
    type LucideIcon
} from 'lucide-react'

const features = [
    {
        icon: Mail,
        title: 'Email to Ticket',
        description: 'Convert customer emails into tickets automatically.'
    },
    {
        icon: BarChart3,
        title: 'Reporting',
        description: 'Track performance and bottlenecks with built-in reports.'
    },
    {
        icon: MessageCircle,
        title: 'Social Desk',
        description: 'Manage social Support interactions from one place.',
        extraIcons: [Facebook, Twitter, Linkedin]
    },
    {
        icon: Zap,
        title: 'Automation',
        description: 'Automate assignments and eliminate repetitive chores.'
    },
    {
        icon: Puzzle,
        title: 'Integrations',
        description: 'Connect payment, translation, and other tools easily.'
    },
    {
        icon: Book,
        title: 'Knowledge Base',
        description: 'Empower customers with a self-service help center.'
    }
]

export default function Features() {
    return (
        <section className="container mx-auto px-4 py-32 mt-20 relative z-20">
            <div className="text-center mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Feature rich helpdesk at $0
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {features.map((feature, index) => (
                    <TiltCard key={index} feature={feature} />
                ))}
            </div>
        </section>
    )
}

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({ feature }: { feature: any }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        xSpring.set(0);
        ySpring.set(0);
    };

    const Icon = feature.icon as LucideIcon

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="relative h-80 w-full max-w-sm rounded-xl bg-gradient-to-br from-white/10 to-transparent"
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-px grid place-content-center rounded-xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md shadow-2xl p-6 text-center border border-white/20"
            >
                <div style={{ transform: "translateZ(75px)" }} className="mx-auto mb-4 p-3 rounded-full bg-white/10 text-white">
                    <Icon size={32} />
                </div>

                <h3
                    style={{ transform: "translateZ(50px)" }}
                    className="text-xl font-bold text-white mb-2"
                >
                    {feature.title}
                </h3>

                <p
                    style={{ transform: "translateZ(50px)" }}
                    className="text-white/60 text-sm leading-relaxed"
                >
                    {feature.description}
                </p>

                {feature.extraIcons && (
                    <div style={{ transform: "translateZ(50px)" }} className="flex gap-3 justify-center mt-4">
                        {feature.extraIcons.map((Icon: LucideIcon, i: number) => (
                            <div key={i} className="text-zinc-500 hover:text-white transition-colors">
                                <Icon size={16} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
