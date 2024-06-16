const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@security': path.resolve(__dirname, 'src/components/layouts/security'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
};