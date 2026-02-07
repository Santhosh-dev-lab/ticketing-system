'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="footer" className="relative w-full bg-black pt-20 pb-10 overflow-hidden text-white/80">

            {/* CTA Section */}
            <div className="relative w-full max-w-6xl mx-auto px-6 mb-32">
                <div className="relative w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-[2/1] md:aspect-[3/1] flex flex-col items-center justify-center p-8 text-center">

                    {/* Background Image with Animation */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] animate-slow-pan">
                            <Image
                                src="/background1.png"
                                alt="Background"
                                fill
                                className="object-cover object-center opacity-60"
                            />
                        </div>
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                    </div>

                    {/* CTA Content */}
                    <div className="relative z-20 space-y-8 animate-fade-up">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                            Ready to automate <span className="italic font-serif font-light text-white/90">everything?</span>
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/signup"
                                className="h-12 px-8 rounded-full bg-white text-black font-semibold flex items-center justify-center hover:bg-gray-200 transition-all hover:scale-105"
                            >
                                Get started
                            </Link>
                            <Link
                                href="#"
                                className="h-12 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">

                {/* Brand Column */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black text-xs">S</span>
                        SupportFlow
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                        Speed, scale, and smarts — deployed. <br />
                        Support that feels human.
                    </p>
                </div>

                {/* Links Column 1 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Product</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Legal</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-white transition-colors">Terms of service</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Privacy policy</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">404</Link></li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Connect</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={14} /> Instagram</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><Youtube size={14} /> YouTube</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><Linkedin size={14} /> LinkedIn</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><Twitter size={14} /> Twitter / X</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 pt-12 text-xs text-white/30 text-center">
                © {new Date().getFullYear()} SupportFlow Inc. All rights reserved.
            </div>
        </footer>
    );
}
