import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only allows listed qualities; 90 keeps the project screenshots crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
