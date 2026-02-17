import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.email !== process.env.ADMIN_EMAIL) {
    redirect('/')
  }

  return user
}

export async function verifyAdminAPI() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return null
  }

  return user
}
