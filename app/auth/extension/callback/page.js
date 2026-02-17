'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ExtensionCallbackPage() {
  useEffect(() => {
    // This page exists for the extension to capture the URL params
    // The extension's background.js listens for this URL pattern

    // Auto-close after a delay if the extension captured the data
    const timer = setTimeout(() => {
      window.close()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="mt-6 text-2xl font-bold">
          Extension Connected!
        </h1>
        <p className="mt-2 text-gray-600">
          You can now close this tab and use FlipChecker on Facebook Marketplace.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          This tab will close automatically...
        </p>
      </div>
    </div>
  )
}
