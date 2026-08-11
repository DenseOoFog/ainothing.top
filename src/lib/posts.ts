import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export function getPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => !post.data.draft);
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return getPublishedPosts(posts).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getFeaturedPosts(posts: BlogPost[], limit = 3): BlogPost[] {
  return sortPosts(posts)
    .filter((post) => post.data.featured)
    .slice(0, limit);
}

export function getRecentPosts(posts: BlogPost[], limit = 6): BlogPost[] {
  return sortPosts(posts).slice(0, limit);
}

export function getPostsByCategory(posts: BlogPost[], category: string, limit?: number): BlogPost[] {
  const matches = sortPosts(posts).filter((post) => post.data.category === category);
  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
}

export function getCategoryCounts(posts: BlogPost[]): Array<{ category: string; count: number }> {
  const counts = new Map<string, number>();

  for (const post of sortPosts(posts)) {
    counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, 'en'));
}
