import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getContentBySlug, getAllSlugs, getAllContent } from '@/lib/content'
import { generatePageMetadata, blogPostSchema, breadcrumbSchema, faqSchema, JsonLd } from '@/lib/seo'
import { ContentLayout } from '@/components/content/ContentLayout'
import { CTABanner } from '@/components/content/CTABanner'
import { FAQSection } from '@/components/content/FAQSection'
import { RelatedPosts } from '@/components/content/RelatedPosts'
import { mdxComponents } from '@/components/content/mdx-components'
import { Clock } from 'lucide-react'

export async function generateStaticParams() {
  return getAllSlugs('guide').map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getContentBySlug('guide', slug)
  if (!post) return {}

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    path: `/guide/${slug}`,
    keywords: post.tags || [],
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
  })
}

export default async function GuidePage({ params }) {
  const { slug } = await params
  const post = getContentBySlug('guide', slug)

  if (!post) {
    notFound()
  }

  const allGuides = getAllContent('guide').map(p => ({ ...p, type: 'guide' }))
  const allBlog = getAllContent('blog').map(p => ({ ...p, type: 'blog' }))
  const relatedPosts = [...allGuides, ...allBlog]
    .filter(p => p.tags?.some(t => post.tags?.includes(t)))
    .slice(0, 3)

  return (
    <ContentLayout
      breadcrumbs={[
        { label: 'Guides', href: '/blog' },
        { label: post.title },
      ]}
    >
      <JsonLd data={blogPostSchema({
        title: post.title,
        description: post.description,
        path: `/guide/${slug}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Guides', path: '/blog' },
        { name: post.title, path: `/guide/${slug}` },
      ])} />
      {post.faqs && <JsonLd data={faqSchema(post.faqs)} />}

      <article className="pt-4 pb-12">
        <header className="mb-8">
          <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
            Guide
          </span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.publishedAt}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="prose prose-lg prose-green max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <CTABanner />

        {post.faqs && <FAQSection faqs={post.faqs} />}

        <RelatedPosts posts={relatedPosts} currentSlug={slug} />
      </article>
    </ContentLayout>
  )
}
