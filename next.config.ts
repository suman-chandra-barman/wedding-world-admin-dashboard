import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "virtual-bridal-fitting-room.weddingworld.de",
      },
    ],
  },
};

export default nextConfig;
