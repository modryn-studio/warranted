// Single source of truth for all site-wide metadata.
// /project-init fills this in from context.md + brand.md.
// Every other file imports from here — never hardcode site metadata elsewhere.
export const site = {
  name: 'Warranted',
  shortName: 'Warranted',
  url: 'https://modrynstudio.com/tools/warranted',
  // Base description — used in <meta description>, manifest, JSON-LD
  description:
    'A daily build briefing for indie hackers. Trending signals scored, Reddit pain validated, competition checked, BUILD or SKIP decision made.',
  // Longer form for social cards
  ogTitle: 'Warranted — Stop guessing. Start building the right thing.',
  ogDescription:
    'Every morning at 6am: trending signals scored, Reddit pain validated, competition checked, BUILD or SKIP decision made. You just execute.',
  founder: 'Luke Hanner',
  // Brand colors — used in manifest theme_color / background_color
  accent: '#F97415',
  bg: '#050505',
  // Social profiles — used in footer links and Twitter card metadata.
  social: {
    twitter: 'https://x.com/lukehanner',
    twitterHandle: '@lukehanner',
    github: 'https://github.com/modryn-studio/warranted',
    devto: 'https://dev.to/lukehanner',
    shipordie: 'https://shipordie.club/lukehanner',
  },
} as const;
