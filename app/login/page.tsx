import { redirect } from 'next/navigation'

export default function Login() {
    redirect('/signup?mode=login')
}
