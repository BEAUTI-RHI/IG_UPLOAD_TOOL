/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent.fmel3-1.fna.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent.fmel3-1.fna.fbcdn.net",
        pathname: "/v/**",
      },
    ],
  },
};

module.exports = nextConfig;
