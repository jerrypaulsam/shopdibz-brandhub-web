/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopdibz-main-1.s3.amazonaws.com",
        pathname: "/media/store/store_logos/**",
      },
      {
        protocol: "https",
        hostname: "www.shopdibz.com",
        pathname: "/media/store/store_logos/**",
      },
      {
        protocol: "https",
        hostname: "shopdibz-test.s3.amazonaws.com",
        pathname: "/media/store/store_logos/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
