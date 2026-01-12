import { AuthForm } from '@/components/AuthForm'

export const metadata = {
  title: 'Login - FlipRadar',
  description: 'Sign in to your FlipRadar account'
}

export default function LoginPage({ searchParams }) {
  const redirect = searchParams?.redirect || '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm mode="login" redirectTo={redirect} />
    </div>
  )
}
