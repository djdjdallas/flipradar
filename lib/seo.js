// lib/seo.js
// Reusable SEO helpers for FlipChecker Next.js 15 app router
// Usage: import { generatePageMetadata, jsonLd } from '@/lib/seo'

const SITE_URL = "https://flipchecker.io";
const SITE_NAME = "FlipChecker";
const DEFAULT_DESCRIPTION =
  "FlipChecker shows you what Facebook Marketplace items are worth on eBay, instantly. Chrome extension for resellers.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate metadata for any page
 * Use in your page.js: export const metadata = generatePageMetadata({ ... })
 *
 * @example
 * // In app/blog/some-post/page.js:
 * import { generatePageMetadata } from '@/lib/seo'
 * export const metadata = generatePageMetadata({
 *   title: 'How to Flip Electronics from Facebook Marketplace to eBay',
 *   description: 'Step-by-step guide to flipping electronics...',
 *   path: '/blog/flip-electronics-facebook-marketplace-to-ebay',
 *   keywords: ['flip electronics', 'facebook marketplace to ebay', 'electronics reselling'],
 * })
 */
export function generatePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  keywords = [],
  ogImage = DEFAULT_OG_IMAGE,
  type = "website", // 'website' | 'article'
  publishedTime = null,
  modifiedTime = null,
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Find Profitable Flips in Seconds`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      locale: "en_US",
      type: type === "article" ? "article" : "website",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ── JSON-LD Schema Generators ──

/**
 * SoftwareApplication schema — use on landing page
 */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FlipChecker",
    description:
      "Chrome extension that shows eBay sold listing prices directly on Facebook Marketplace item pages for resellers.",
    url: SITE_URL,
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
        description: "10 price lookups per day, 25 saved deals",
      },
      {
        "@type": "Offer",
        price: "19",
        priceCurrency: "USD",
        name: "Flipper",
        description:
          "100 price lookups per day, 500 saved deals, real eBay active listings",
      },
      {
        "@type": "Offer",
        price: "39",
        priceCurrency: "USD",
        name: "Pro",
        description:
          "500 price lookups per day, unlimited saved deals, real eBay sold data",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  };
}

/**
 * Organization schema — use on landing page
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FlipChecker",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon128.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@flipchecker.io",
      contactType: "customer support",
    },
  };
}

/**
 * BlogPosting schema — use on each blog/guide page
 *
 * @example
 * const schema = blogPostSchema({
 *   title: 'How to Flip Electronics...',
 *   description: 'Step-by-step guide...',
 *   path: '/blog/flip-electronics-facebook-marketplace-to-ebay',
 *   datePublished: '2026-02-16',
 *   dateModified: '2026-02-16',
 * })
 */
export function blogPostSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image = DEFAULT_OG_IMAGE,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: "FlipChecker",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FlipChecker",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icons/icon128.png`,
      },
    },
    image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };
}

/**
 * FAQ schema — use on pricing page or any page with FAQ section
 *
 * @example
 * const schema = faqSchema([
 *   { question: 'How does FlipChecker work?', answer: 'FlipChecker shows...' },
 *   { question: 'Is FlipChecker free?', answer: 'Yes, the free tier...' },
 * ])
 */
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema
 *
 * @example
 * const schema = breadcrumbSchema([
 *   { name: 'Home', path: '/' },
 *   { name: 'Blog', path: '/blog' },
 *   { name: 'How to Flip Electronics', path: '/blog/flip-electronics-...' },
 * ])
 */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// ── Helper: Render JSON-LD in a page ──

/**
 * Component to inject JSON-LD into page head
 *
 * @example
 * // In your page.js:
 * import { JsonLd, blogPostSchema } from '@/lib/seo'
 *
 * export default function BlogPost() {
 *   return (
 *     <>
 *       <JsonLd data={blogPostSchema({ title: '...', ... })} />
 *       <article>...</article>
 *     </>
 *   )
 * }
 */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
