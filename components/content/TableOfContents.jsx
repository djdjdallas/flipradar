'use client'

export function TableOfContents({ headings = [] }) {
  if (headings.length === 0) return null

  return (
    <nav className="bg-gray-50 rounded-xl p-6 mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading, i) => (
          <li key={i}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
