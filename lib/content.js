import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get a single content item by type and slug
 */
export function getContentBySlug(type, slug) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    content,
    readingTime: stats.text,
    ...data,
  };
}

/**
 * Get all content items for a given type, sorted by date descending
 */
export function getAllContent(type) {
  const dir = path.join(contentDirectory, type);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

  const items = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(dir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      readingTime: stats.text,
      ...data,
    };
  });

  return items.sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0);
    const dateB = new Date(b.publishedAt || 0);
    return dateB - dateA;
  });
}

/**
 * Get all slugs for a given content type (for generateStaticParams)
 */
export function getAllSlugs(type) {
  const dir = path.join(contentDirectory, type);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}
