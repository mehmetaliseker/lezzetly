import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
