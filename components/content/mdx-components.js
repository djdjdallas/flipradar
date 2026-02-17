import Link from 'next/link'
import { CTABanner } from './CTABanner'

function CustomLink({ href, children, ...props }) {
  if (href?.startsWith('/')) {
    return <Link href={href} {...props}>{children}</Link>
  }
  if (href?.startsWith('#')) {
    return <a href={href} {...props}>{children}</a>
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
}

function InlineCTA() {
  return <CTABanner />
}

export const mdxComponents = {
  a: CustomLink,
  InlineCTA,
  img: (props) => (
    <img {...props} className="rounded-lg my-6" loading="lazy" />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table {...props} className="min-w-full" />
    </div>
  ),
}
