﻿const { createProxyMiddleware } = require('http-proxy-middleware');

const context = ["/api"];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:5001',
        secure: false
    });

    app.use(appProxy);
};
