import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: false, 
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    
    optimizePackageImports: ["lucide-react", "framer-motion", "lucide-react"],
  },
};

export default nextConfig;