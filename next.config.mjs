/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Admin SDK is not compatible with Next.js's edge runtime.
  // This ensures it is handled correctly in the Node.js server environment.
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

export default nextConfig;
