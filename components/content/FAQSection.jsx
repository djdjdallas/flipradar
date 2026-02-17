'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null)

  if (faqs.length === 0) return null

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50 transition-colors"
            >
              {faq.question}
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
