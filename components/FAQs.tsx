'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
    {
        question: "How does the AI ticket categorization work?",
        answer: "Our AI analyzes the content of incoming tickets to automatically assign priority levels and categories. This ensures that urgent issues are flagged immediately and routed to the correct department without manual intervention."
    },
    {
        question: "Can I integrate SupportFlow with my existing tools?",
        answer: "Yes, SupportFlow offers seamless integration with popular tools like Slack, Jira, and Salesforce. You can sync data in real-time and manage your entire support workflow from a single dashboard."
    },
    {
        question: "Is there a limit to the number of tickets I can manage?",
        answer: "No, our platform is designed to scale with your business. Whether you handle 10 or 10,000 tickets a day, SupportFlow works without performance degradation."
    },
    {
        question: "How secure is my customer data?",
        answer: "We take security seriously. All data is encrypted at rest and in transit using industry-standard protocols. We are SOC2 compliant and perform regular security audits to ensure your information is always safe."
    },
    {
        question: "Can I customize the automated responses?",
        answer: "Absolutely. You can set up custom templates and rules for automated replies. The AI Copilot can also draft responses based on your knowledge base, which you can review before sending."
    }
];

export default function FAQs() {
    return (
        <section id="faqs" className="container mx-auto px-4 py-24 relative z-20">
            <div className="text-center mb-16 animate-fade-up">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    We’ve got answers
                </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </section>
    );
}

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden transition-all hover:bg-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="text-lg font-medium text-white/90">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 ml-4"
                >
                    <Plus className="text-white/60 w-6 h-6" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-white/60 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
