import Link from 'next/link'
import { Chrome } from 'lucide-react'

export function CTABanner() {
  return (
    <div className="my-12 bg-[#09090B] border-2 border-[#D2E823] p-8 text-center">
      <h3 className="text-2xl font-bold mb-2 text-white">Try FlipChecker Free</h3>
      <p className="text-[#F8F4E8]/60 mb-6">
        10 free lookups per day. No credit card required.
      </p>
      <Link
        href="/auth/signup"
        className="inline-flex items-center gap-2 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] px-8 py-3 font-bold text-sm uppercase hard-shadow btn-brutal"
        style={{ boxShadow: '4px 4px 0px 0px #D2E823' }}
      >
        <Chrome className="h-5 w-5" />
        Get Started Free
      </Link>
    </div>
  )
}
