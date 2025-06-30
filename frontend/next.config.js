/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This configuration allows any hostname, which includes the data URLs
    // used for the base64 word clouds.
    unoptimized: true,
  },
};

module.exports = nextConfig;