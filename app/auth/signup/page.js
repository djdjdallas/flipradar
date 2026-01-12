import { AuthForm } from '@/components/AuthForm'

export const metadata = {
  title: 'Sign Up - FlipRadar',
  description: 'Create your FlipRadar account'
}

export default function SignupPage({ searchParams }) {
  const redirect = searchParams?.redirect || '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm mode="signup" redirectTo={redirect} />
    </div>
  )
}
