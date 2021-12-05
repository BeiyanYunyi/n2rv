/* eslint-disable no-console */
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import app from './app';

require('express-async-errors');

const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(`${__dirname}/..`);
const port = process.env.PORT || 3000;
if (isProduction) {
  const key = fs.readFileSync(path.join(root, 'certs', 'priv.key')).toString();
  const cert = fs.readFileSync(path.join(root, 'certs', 'pub.cer')).toString();
  const server = https.createServer({ key, cert }, app);
  server.listen(port);
} else {
  const server = http.createServer(app);
  server.listen(port);
}
console.log(`Server running at http://localhost:${port}`);
