// next.config.mjs
const API_BASE_URL = (process.env.API_BASE_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you're on Next 13/14/15 this works the same
  async rewrites() {
    return [
      // Anything the app calls under /api/v1/* is forwarded to the Express backend
      { source: "/api/v1/:path*", destination: `${API_BASE_URL}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
