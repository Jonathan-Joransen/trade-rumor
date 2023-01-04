/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nbatraderumor.com',
        port: '',
        pathname: '',
      },
      {
        protocol: 'https',
        hostname: '104.248.108.118',
        port: '',
        pathname: '',
      },
    ],
  },
}

module.exports = nextConfig
