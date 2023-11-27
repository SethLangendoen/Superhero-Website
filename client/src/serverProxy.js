const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // Replace with your backend route prefix
    createProxyMiddleware({
      target: 'http://localhost:3000',  // Your backend server URL
      changeOrigin: true,
    })
  );
};
