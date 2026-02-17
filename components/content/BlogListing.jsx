import Link from 'next/link'
import { Clock } from 'lucide-react'

export function BlogListing({ posts, basePath = '/blog' }) {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-500 text-center py-8">No posts yet.</p>
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`${basePath}/${post.slug}`}
          className="group block bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            {post.category && (
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                {post.category}
              </span>
            )}
            <h3 className="mt-2 text-lg font-semibold group-hover:text-green-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {post.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
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
