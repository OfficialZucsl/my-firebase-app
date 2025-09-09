import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make the FIREBASE_SERVICE_ACCOUNT_KEY available to server-side code
  serverRuntimeConfig: {
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  },
};

export default nextConfig;
