const path = require('path');

const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
  plugins: [],
  webpack: {
    alias: {
      '@': resolvePath('./src/'),
    },
  },
};
