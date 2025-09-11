/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Note: 'allowedDevOrigins' is no longer in 'experimental' as of Next.js 14.2
  },
  // allowedDevOrigins is a top-level property for Next.js 14.2+
  allowedDevOrigins: [
    'https://6000-firebase-studio-1755764725401.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev',
  ],
};

export default nextConfig;
