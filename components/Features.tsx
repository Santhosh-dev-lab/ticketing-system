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
import { DrawOnScrollIcon } from "./DrawOnScrollIcon";
import { iconPaths } from "./iconPaths";

const features = [
    {
        icon: Mail,
        paths: iconPaths.mail,
        title: 'Email to Ticket',
        description: 'Convert customer emails into tickets automatically.'
    },
    {
        icon: BarChart3,
        paths: iconPaths.reporting,
        title: 'Reporting',
        description: 'Track performance and bottlenecks with built-in reports.'
    },
    {
        icon: MessageCircle,
        paths: iconPaths.social,
        title: 'Social Desk',
        description: 'Manage social Support interactions from one place.',
        extraIcons: [
            // Facebook
            {
                paths: ["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
                viewBox: "0 0 24 24"
            },
            // X (Twitter)
            {
                paths: ["M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z"],
                viewBox: "0 0 24 24",
                fillAfterDraw: false, // Outline only
                strokeWidth: 1 // Thinner stroke for clear outline
            },
            // LinkedIn
            {
                paths: [
                    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                    "M2 9h4v12H2z",
                    "M4 2a2 2 0 1 1-1.44 2.36A2 2 0 0 1 4 2z"
                ],
                viewBox: "0 0 24 24"
            }
        ]
    },
    {
        icon: Zap,
        paths: iconPaths.automation,
        title: 'Automation',
        description: 'Automate assignments and eliminate repetitive chores.'
    },
    {
        icon: Puzzle,
        paths: iconPaths.integrations,
        title: 'Integrations',
        description: 'Connect payment, translation, and other tools easily.'
    },
    {
        icon: Book,
        paths: iconPaths.knowledge,
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
                <div style={{ transform: "translateZ(75px)" }} className="mx-auto mb-4 p-3 rounded-full bg-white/10 text-white w-14 h-14 flex items-center justify-center">
                    {feature.paths ? (
                        <DrawOnScrollIcon paths={feature.paths} viewBox="0 0 24 24" />
                    ) : (
                        <Icon size={32} />
                    )}
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
                        {feature.extraIcons.map((item: any, i: number) => {
                            if (item.paths) {
                                return (
                                    <div key={i} className="text-zinc-500 hover:text-white transition-colors w-5 h-5">
                                        <DrawOnScrollIcon
                                            paths={item.paths}
                                            viewBox={item.viewBox}
                                            fillAfterDraw={item.fillAfterDraw}
                                            strokeWidth={item.strokeWidth}
                                        />
                                    </div>
                                )
                            }
                            const Icon = item as LucideIcon;
                            return (
                                <div key={i} className="text-zinc-500 hover:text-white transition-colors">
                                    <Icon size={16} />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
