/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nbatraderumor.com',
        port: '3000',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: '104.248.108.118',
        port: '3000',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'nbatraderumor.com',
        port: '443',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: '104.248.108.118',
        port: '443',
        pathname: '/*',
      },
    ],
  },
}

module.exports = nextConfig
