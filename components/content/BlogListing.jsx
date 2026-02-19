import Link from 'next/link'
import { Clock } from 'lucide-react'

export function BlogListing({ posts, basePath = '/blog' }) {
  if (!posts || posts.length === 0) {
    return <p className="text-[#09090B]/50 text-center py-8">No posts yet.</p>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`${basePath}/${post.slug}`}
          className="group block bg-white border-2 border-[#09090B] overflow-hidden hard-shadow-sm btn-brutal"
        >
          <div className="p-6">
            {post.category && (
              <span className="inline-block text-xs font-bold text-[#D2E823] bg-[#09090B] uppercase tracking-wide px-2 py-1">
                {post.category}
              </span>
            )}
            <h3 className="mt-2 text-lg font-semibold group-hover:text-[#D2E823] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-[#09090B]/60 line-clamp-2">
              {post.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-[#09090B]/50">
              <span>{post.publishedAt}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
