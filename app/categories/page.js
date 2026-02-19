import { ContentLayout } from '@/components/content/ContentLayout'
import { BlogListing } from '@/components/content/BlogListing'
import { getAllContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: 'Categories',
  description: 'Browse flipping guides by category. Find the best items to flip in electronics, furniture, clothing, and more.',
  path: '/categories',
  keywords: ['flipping categories', 'best items to flip', 'what to resell', 'profitable categories'],
})

export default function CategoriesPage() {
  const posts = getAllContent('categories')

  return (
    <ContentLayout breadcrumbs={[{ label: 'Categories' }]}>
      <div className="pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-4">Categories</h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse flipping guides by category to find the most profitable items to resell.
        </p>
        <BlogListing posts={posts} basePath="/categories" />
      </div>
    </ContentLayout>
  )
}
