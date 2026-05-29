import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack with polling for reliable hot-reload inside Docker containers.
  // Polling is needed because native file watchers (fs.watch/inotify)
  // often fail to propagate changes through Docker bind mounts on macOS/Windows.
  // Used via `next dev --no-turbopack` in Dockerfile.dev.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,           // Check for changes every 1 second
        aggregateTimeout: 300, // Wait 300ms after last change before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;
