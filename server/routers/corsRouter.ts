import express from 'express';
import corsAnywhere from 'cors-anywhere';
import getImgID from '../utils/getImgID';
import Storage from '../storageProviders/Storage';

require('express-async-errors');

const corsRouter = express.Router();

const proxy = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeaders: [], // Do not require any headers.
  removeHeaders: ['cookie', 'cookie2', 'referer'], // Do not remove any headers.
});

corsRouter.get('/:proxyUrl*', async (req, res) => {
  const imgID = getImgID(req.url.substring(1));
  const imgBlob = await Storage.getImg(imgID);
  if (imgBlob) {
    res.header({ 'Content-Type': 'image/jpeg' });
    return res.send(imgBlob);
  }
  return proxy.emit('request', req, res);
});

export default corsRouter;
