
/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    }
};

export default nextConfig;
