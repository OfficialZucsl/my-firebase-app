/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is to allow cross-origin requests in development,
    // which is common in cloud-based IDEs.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
};

export default nextConfig;
