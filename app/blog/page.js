import { ContentLayout } from '@/components/content/ContentLayout'
import { BlogListing } from '@/components/content/BlogListing'
import { getAllContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Tips, guides, and strategies for flipping items from Facebook Marketplace to eBay. Learn how to find deals, price items, and maximize profit.',
  path: '/blog',
  keywords: ['facebook marketplace flipping', 'ebay reselling', 'flipping blog', 'reseller tips'],
})

export default function BlogPage() {
  const posts = getAllContent('blog')

  return (
    <ContentLayout breadcrumbs={[{ label: 'Blog' }]}>
      <div className="pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-4">FlipChecker Blog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Tips, guides, and strategies for flipping items from Facebook Marketplace to eBay.
        </p>
        <BlogListing posts={posts} />
      </div>
    </ContentLayout>
  )
}
