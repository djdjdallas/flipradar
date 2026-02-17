import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export function CTABanner() {
  return (
    <div className="my-12 bg-green-50 border border-green-200 rounded-xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-2">Try FlipChecker Free</h3>
      <p className="text-gray-600 mb-6">
        10 free lookups per day. No credit card required.
      </p>
      <Link href="/auth/signup">
        <Button size="lg" className="gap-2">
          <Chrome className="h-5 w-5" />
          Get Started Free
        </Button>
      </Link>
    </div>
  )
}
