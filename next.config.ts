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
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],

  },
  turbopack: {
    root: './',
  },
};

export default nextConfig;
