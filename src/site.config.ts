export const siteConfig = {
  title: 'AInothing',
  description:
    'A practical AIGC field studio for private browser tools, tested prompt research, original tutorials, and carefully filtered AI signals.',
  siteUrl: 'https://ainothing.top',
  author: 'AInothing',
  tagline: 'Useful AI, tested in public.',
  navigation: [
    { href: '/tools', label: 'Tools' },
    { href: '/resources', label: 'Prompt Lab' },
    { href: '/blog', label: 'Tutorials' },
    { href: '/blog', label: 'Briefs' },
    { href: '/about', label: 'About' },
  ],
  home: {
    eyebrow: 'Independent AIGC field studio · 2026',
    title: 'Make something useful with AI.',
    intro:
      'A working library of private browser tools, tested prompt systems, practical tutorials, and the few AI updates that actually change a creator’s workflow.',
    promise:
      'No infinite link dumps. No recycled hype. Everything here should help you make, understand, or decide something.',
  },
  footer:
    'A long-term field studio for practical AI tools, prompt research, creator workflows, and original experiments.',
} as const;
