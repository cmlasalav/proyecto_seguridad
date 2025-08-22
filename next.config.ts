import type { NextConfig } from "next";
const path = require("path");
const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias["@components"] = path.join(__dirname, "components");
    return config;
  },
};

export default nextConfig;
