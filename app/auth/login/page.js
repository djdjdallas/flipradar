import { AuthForm } from '@/components/AuthForm'

export const metadata = {
  title: 'Login - FlipChecker',
  description: 'Sign in to your FlipChecker account'
}

export default function LoginPage({ searchParams }) {
  const redirect = searchParams?.redirect || '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4E8] px-4 relative">
      <div className="noise-overlay" />
      <AuthForm mode="login" redirectTo={redirect} />
    </div>
  )
}
