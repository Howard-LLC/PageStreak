/** @type {import('next').NextConfig} */
const isPagesBuild = process.env.GITHUB_PAGES === 'true';
const repo = 'page-streak';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPagesBuild ? `/${repo}` : undefined,
  assetPrefix: isPagesBuild ? `/${repo}/` : undefined,
  reactStrictMode: true,
};

export default nextConfig;
