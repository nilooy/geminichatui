/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: "worker-loader" }, // FIXME: Enable Worker
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/chat",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // FIXME
  },
  typescript: {
    ignoreBuildErrors: true, // FIXME
  },
};

module.exports = nextConfig;
