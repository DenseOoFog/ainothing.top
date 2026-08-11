import { describe, expect, it } from 'vitest';
import { getCategoryCounts, getFeaturedPosts, getPostsByCategory, getPublishedPosts, sortPosts } from './posts';

const posts = [
  {
    id: 'old-featured',
    data: {
      title: 'old-featured',
      description: 'desc',
      pubDate: new Date('2025-01-01'),
      category: 'Revenue Breakdowns',
      tags: [],
      featured: true,
      draft: false,
    },
  },
  {
    id: 'new-normal',
    data: {
      title: 'new-normal',
      description: 'desc',
      pubDate: new Date('2025-03-01'),
      category: 'AI Signals',
      tags: [],
      featured: false,
      draft: false,
    },
  },
  {
    id: 'new-featured',
    data: {
      title: 'new-featured',
      description: 'desc',
      pubDate: new Date('2025-04-01'),
      category: 'Revenue Breakdowns',
      tags: [],
      featured: true,
      draft: false,
    },
  },
  {
    id: 'draft-post',
    data: {
      title: 'draft-post',
      description: 'desc',
      pubDate: new Date('2025-05-01'),
      category: 'AI Signals',
      tags: [],
      featured: true,
      draft: true,
    },
  },
] as any;

describe('post helpers', () => {
  it('returns published posts only for route generation', () => {
    expect(getPublishedPosts(posts).map((post) => post.id)).toEqual(['old-featured', 'new-normal', 'new-featured']);
  });

  it('sorts posts by newest first and excludes drafts', () => {
    expect(sortPosts(posts).map((post) => post.id)).toEqual(['new-featured', 'new-normal', 'old-featured']);
  });

  it('returns featured posts only', () => {
    expect(getFeaturedPosts(posts).map((post) => post.id)).toEqual(['new-featured', 'old-featured']);
  });

  it('returns posts for a specific category', () => {
    expect(getPostsByCategory(posts, 'Revenue Breakdowns').map((post) => post.id)).toEqual([
      'new-featured',
      'old-featured',
    ]);
  });

  it('counts categories across published posts', () => {
    expect(getCategoryCounts(posts)).toEqual([
      { category: 'Revenue Breakdowns', count: 2 },
      { category: 'AI Signals', count: 1 },
    ]);
  });
});
