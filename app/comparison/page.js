import { ContentLayout } from '@/components/content/ContentLayout'
import { BlogListing } from '@/components/content/BlogListing'
import { getAllContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Comparisons',
  description: 'Side-by-side comparisons of reselling tools, platforms, and strategies. Find the best options for your flipping business.',
  path: '/comparison',
  keywords: ['reselling tool comparison', 'flipping platform comparison', 'ebay vs marketplace', 'reseller tools'],
})

export default function ComparisonPage() {
  const posts = getAllContent('comparison')

  return (
    <ContentLayout breadcrumbs={[{ label: 'Comparisons' }]}>
      <div className="pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-4">Comparisons</h1>
        <p className="text-xl text-gray-600 mb-8">
          Side-by-side comparisons of reselling tools, platforms, and strategies.
        </p>
        <BlogListing posts={posts} basePath="/comparison" />
      </div>
    </ContentLayout>
  )
}
