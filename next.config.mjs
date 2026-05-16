/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbopack: {
  //   root: process.cwd(),
  // },
  // trailingSlash: true,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopdibz-main-1.s3.amazonaws.com",
        pathname: "/media/store/**",
      },
      {
        protocol: "https",
        hostname: "www.shopdibz.com",
        pathname: "/media/store/**",
      },
      {
        protocol: "https",
        hostname: "shopdibz-test.s3.amazonaws.com",
        pathname: "/media/store/**",
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
