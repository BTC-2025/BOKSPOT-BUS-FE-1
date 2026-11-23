import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: 'E:\\BOKSPOT\\BOKSPOT-BUS-FE-1',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:9000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
