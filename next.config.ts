import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // applicationinsights (and its diagnostic-channel-publishers dependency) do
  // dynamic `require()` calls that Turbopack/webpack can't statically bundle —
  // keep them as real Node requires at runtime instead of trying to trace them.
  serverExternalPackages: ["applicationinsights"],
};

export default nextConfig;
