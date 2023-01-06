/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nbatraderumor.com',
        port: '443',
        pathname: '/*',
      },
    ],
  },
}

module.exports = nextConfig
