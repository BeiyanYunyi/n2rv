/* eslint-disable no-console */
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { createPageRenderer } from 'vite-plugin-ssr';
import corsRouter from './routers/corsRouter';

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}/..`;

(async () => {
  const app = express();
  app.use('/cors', corsRouter);
  if (isProduction) {
    app.use('/assets', express.static('../assets'));
  } else {
    app.use('/assets', express.static('../../assets'));
  }
  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // eslint-disable-next-line global-require
    const vite = require('vite');
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    return res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3000;
  if (isProduction) {
    const key = fs.readFileSync(path.join(root, 'certs', 'priv.key'));
    const cert = fs.readFileSync(path.join(root, 'certs', 'pub.cer'));
    const server = https.createServer({ key, cert }, app);
    server.listen(port);
  } else {
    const server = http.createServer(app);
    server.listen(port);
  }
  console.log(`Server running at http://localhost:${port}`);
})();
