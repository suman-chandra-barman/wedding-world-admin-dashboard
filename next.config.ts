import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.weddingworld.de",
      },
    ],
  },
};

export default nextConfig;
