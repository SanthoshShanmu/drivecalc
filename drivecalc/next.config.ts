import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/bompengekalkulator',
        destination: '/',
        permanent: false,
      },
      {
        source: '/bensinpriser',
        destination: '/',
        permanent: false,
      },
      {
        source: '/beregn-kjørekostnad',
        destination: '/',
        permanent: false,
      }
    ]
  }
};

export default nextConfig;
