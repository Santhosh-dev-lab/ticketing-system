'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

export default function LogoutButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="group flex p-2 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/60 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Log Out"
        >
            {pending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
            )}
        </button>
    );
}
