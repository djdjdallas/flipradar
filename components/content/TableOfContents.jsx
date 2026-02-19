'use client'

export function TableOfContents({ headings = [] }) {
  if (headings.length === 0) return null

  return (
    <nav className="bg-[#09090B]/5 border-2 border-[#09090B] p-6 mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#09090B]/60 mb-3">
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading, i) => (
          <li key={i}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-[#09090B]/60 hover:text-[#D2E823] transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
