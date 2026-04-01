import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance & Development Optimizations */
  reactStrictMode: false, // Disabling strict mode in dev can sometimes speed up re-renders
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // These might help with compilation speed and page transitions
    optimizePackageImports: ["lucide-react", "framer-motion", "lucide-react"],
  },
};

export default nextConfig;