import { ContentLayout } from '@/components/content/ContentLayout'
import { BlogListing } from '@/components/content/BlogListing'
import { getAllContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Guides',
  description: 'In-depth guides for flipping items from Facebook Marketplace to eBay. Step-by-step walkthroughs to help you source, list, and sell for profit.',
  path: '/guide',
  keywords: ['flipping guide', 'reselling guide', 'facebook marketplace to ebay', 'how to flip items'],
})

export default function GuidePage() {
  const posts = getAllContent('guide')

  return (
    <ContentLayout breadcrumbs={[{ label: 'Guides' }]}>
      <div className="pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-4">Guides</h1>
        <p className="text-xl text-gray-600 mb-8">
          In-depth guides to help you source, list, and sell items for profit.
        </p>
        <BlogListing posts={posts} basePath="/guide" />
      </div>
    </ContentLayout>
  )
}
