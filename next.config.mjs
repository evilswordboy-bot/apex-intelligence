/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/cricket/:path*',
        destination: 'http://127.0.0.1:8000/api/cricket/:path*',
      },
      {
        source: '/api/agent/:path*',
        destination: 'http://127.0.0.1:8000/api/agent/:path*',
      },
    ];
  },
};

export default nextConfig;
