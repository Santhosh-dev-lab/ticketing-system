import Link from 'next/link'
import { login } from './actions'

export default function Login({ searchParams }: { searchParams: { message: string, error: string } }) {
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 m-auto min-h-screen bg-gray-50">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
            </Link>

            <div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h1>
                    <p className="text-gray-500 text-center">Sign in to your account</p>
                </div>

                <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                    <button
                        formAction={login}
                        className="bg-black rounded-md px-4 py-2 text-foreground text-white mb-2 hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Sign In
                    </button>

                    {searchParams?.error && (
                        <p className="p-4 bg-red-100 text-red-600 text-center rounded-md text-sm mt-2">
                            {searchParams.error}
                        </p>
                    )}
                    {searchParams?.message && (
                        <p className="p-4 bg-blue-100 text-blue-600 text-center rounded-md text-sm mt-2">
                            {searchParams.message}
                        </p>
                    )}

                    <div className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
