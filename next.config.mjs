import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {(phase: string) => import('next').NextConfig} */
export default function nextConfig(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    // In dev, React Strict Mode intentionally double-invokes effects/renders.
    // Turn it off to avoid "double load" behavior during local development.
    reactStrictMode: !isDev,
    poweredByHeader: false,
    compress: true,

    // Next.js 16 enables Turbopack by default in many environments (e.g. Vercel).
    // If a `webpack` function is present, Next requires a `turbopack` config too.
    turbopack: {},

    // Helps on Windows when `.next` intermittently misses cache artifacts (prevents `__webpack_modules__` corruption)
    webpack(config) {
      if (isDev) {
        config.cache = false;
      }
      return config;
    },

    async rewrites() {
      return [{ source: "/favicon.ico", destination: "/skilltree-icon-lg.svg" }];
    },

    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-DNS-Prefetch-Control", value: "on" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ];
    },
  };
}
