import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.devtunnels.ms",
      }
    ],
  },
};

export default nextConfig;
