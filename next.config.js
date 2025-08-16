// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This setting disables Turbopack for the dev server,
  // ensuring we use the more stable Webpack engine which resolves our CSS issues.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Allows any path under this hostname
      },
    ],
  },
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;