import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Stop ESLint errors/warnings from breaking Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Allow external images (optional, if you use images from URLs)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ✅ Define your backend URL (used in fetch calls)
  env: {
    API_URL: process.env.API_URL || "https://learn-cybersecurity-with-vuneat.onrender.com",
  },

  
};

export default nextConfig;
