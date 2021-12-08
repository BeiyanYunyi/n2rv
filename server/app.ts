/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import { createPageRenderer } from 'vite-plugin-ssr';
import config from '../config/config.json';
import renderSiteMap from '../renderer/utils/renderSiteMap';
import Storage from './storageProviders/Storage';
import apiRouter from './routers/apiRouter';
import corsRouter from './routers/corsRouter';

require('express-async-errors');

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(`${__dirname}/..`);
const logoPath = path.join(root, 'static');

const app = express();
app.use('/static', express.static(logoPath));
app.use('/uploads', express.static(config.upload.uploadFileStoragePath));
app.get('/sitemap', async (_req, res) => {
  const sitemap = await renderSiteMap();
  res.send(sitemap);
});
app.use('/cors', corsRouter);
app.use('/api', apiRouter);
(async () => {
  await Storage.init();
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
})();

export default app;
