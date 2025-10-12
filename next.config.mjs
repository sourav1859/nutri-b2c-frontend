// next.config.mjs

// Prefer NEXT_PUBLIC_API_BASE_URL (so the same value is available in the browser if needed),
// then NEXT_PUBLIC_API_BASE, then API_BASE_URL. If a hostname is provided without scheme,
// normalize to https:// (Vercel requires destination to start with http/https or /).
const RAW_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.API_BASE_URL ||
  ""
).trim();

const API_BASE = (
  RAW_BASE
    ? (/^https?:\/\//i.test(RAW_BASE) ? RAW_BASE : `https://${RAW_BASE}`)
    : "http://127.0.0.1:5000"
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
