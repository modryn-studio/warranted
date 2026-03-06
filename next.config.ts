import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // React Compiler adds significant overhead in dev (6+ min cold compile). Enable for prod only.
  reactCompiler: !isDev,
  // basePath is filled in by /init from the URL field in context.md.
  // Format: '/tools/your-slug'
  // Must match the source path in modryn-studio-v2's next.config.ts rewrites().
  basePath: '/tools/warranted',
};

export default nextConfig;
