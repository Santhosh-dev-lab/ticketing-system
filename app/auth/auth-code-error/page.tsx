import Link from 'next/link'

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="max-w-md w-full bg-[#1A1F2E] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
                <p className="text-white/60 mb-8">
                    There was an error verifying your login. This link may have expired or is invalid.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="block w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Try Logging In Again
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-3 px-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
