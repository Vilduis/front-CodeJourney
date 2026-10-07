import type { NextConfig } from "next";

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
