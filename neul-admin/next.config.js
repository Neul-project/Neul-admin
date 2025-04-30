const withTM = require("next-transpile-modules")([
  "@ant-design/icons-svg",
  "@ant-design/icons",
  "rc-tree",
  "rc-util",
  "rc-pagination",
  "rc-picker",
  "rc-table",
  "rc-input",
]); // Add other packages as needed
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // This enables SWC's minification
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = withTM(nextConfig);
