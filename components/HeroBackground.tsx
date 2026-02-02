'use client'

import { motion } from 'framer-motion'

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">

            {/* 1. Main "Curtain" Gradient - The Flowing River */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60"
                style={{
                    background: `conic-gradient(from 180deg at 50% 50%, #000000 0deg, #0a0a0a 120deg, #0f172a 160deg, #3b82f6 200deg, #10b981 240deg, #6366f1 280deg, #000000 360deg)`,
                    filter: 'blur(80px)',
                    transform: 'rotate(-15deg)',
                }}
            />

            {/* 2. The "Ribbon" - Brighter, sharper wave in the center */}
            <motion.div
                animate={{
                    transform: [
                        "translate(-10%, -10%) rotate(-20deg) scale(1)",
                        "translate(0%, 0%) rotate(-20deg) scale(1.1)",
                        "translate(-10%, -10%) rotate(-20deg) scale(1)"
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 top-[-20%] left-[-20%] w-[150%] h-[150%] opacity-80 mix-blend-color-dodge"
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.4) 0%, rgba(16, 185, 129, 0.2) 20%, rgba(99, 102, 241, 0.2) 40%, transparent 70%)`,
                    filter: 'blur(60px)',
                }}
            />

            {/* 3. Moving High-Lights (The "Sheen" on the curtain) */}
            <motion.div
                animate={{
                    x: ['-20%', '20%', '-20%'],
                    y: ['0%', '10%', '0%'],
                    rotate: [-20, -15, -20],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear" // Continuous flow
                }}
                className="absolute top-[20%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[50px] mix-blend-screen"
                style={{ rotate: '-20deg' }}
            />

            <motion.div
                animate={{
                    x: ['20%', '-20%', '20%'],
                    y: ['0%', '-15%', '0%'],
                    rotate: [-20, -25, -20],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[20%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-[60px] mix-blend-screen"
                style={{ rotate: '-20deg' }}
            />


            {/* 4. Texture overlay for realism */}
            <div
                className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* 5. Vignette to focus center */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none" />
        </div>
    )
}
