import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pyzpdyaqsrbgstfdlycz.supabase.co',
        pathname: '/storage/**',
      },
    ],

  },
  turbopack: {
    root: './',
  },
};

export default nextConfig;
