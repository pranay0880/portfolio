import type { NextConfig } from "next";

// The App Service default hostname serves the same site; send it to the
// custom domain so search engines and link previews only see one origin.
const AZURE_HOST = "pradeep-portfolio-web.azurewebsites.net";
const CANONICAL_URL = "https://pranaydasari.in";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only allows listed qualities; 90 keeps the project screenshots crisp.
    qualities: [75, 90],
  },
  async redirects() {
    return [
      {
        // Leave the App Service health check reachable on the default host.
        source: "/:path((?!api/health$).*)",
        has: [{ type: "host", value: AZURE_HOST }],
        destination: `${CANONICAL_URL}/:path`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
