// next.config.mjs

// Prefer NEXT_PUBLIC_API_BASE (so the same value is available in the browser if needed),
// fall back to API_BASE_URL, then to local dev default.
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE_URL ||
  "http://127.0.0.1:5000"
).replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Only proxy API calls; do NOT rewrite /_next/* (prevents missing CSS/JS)
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_BASE}/api/v1/:path*` },
    ];
  },

  // (Optional) keep these strict; flip to true only if you intentionally want to ship with lints/TS errors.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
