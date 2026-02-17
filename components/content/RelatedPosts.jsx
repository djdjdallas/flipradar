import Link from 'next/link'

export function RelatedPosts({ posts = [], currentSlug }) {
  const filtered = posts
    .filter(p => p.slug !== currentSlug)
    .slice(0, 3)

  if (filtered.length === 0) return null

  return (
    <div className="my-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(post => (
          <Link
            key={post.slug}
            href={`/${post.type || 'blog'}/${post.slug}`}
            className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-sm line-clamp-2">{post.title}</h3>
            <p className="mt-1 text-xs text-gray-500">{post.readingTime}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
