import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    additionalData: `@use "variables" as *; @use "mixins" as *;`,
  },
};

export default nextConfig;
