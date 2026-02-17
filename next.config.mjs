/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'flipradar.vercel.app' }],
        destination: 'https://flipchecker.io/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
