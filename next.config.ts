import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/editor',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
