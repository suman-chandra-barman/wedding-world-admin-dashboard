import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.devtunnels.ms",
      },
      {
        protocol: "http",
        hostname: "**.devtunnels.ms",
      },
      {
        protocol: "https",
        hostname: "api.hey-ineed.com",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
