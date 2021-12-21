import express from 'express';
import { UnauthorizedError } from 'express-jwt';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.json';
import Topic from '../../../types/Topic';
import Storage from '../../storageProviders/Storage';

const scraperRouter = express.Router();
const SECRET = config.signingConfig.jwtSecrets;

require('express-async-errors');

scraperRouter.use(async (req) => {
  const authHeader = req.headers.authorization?.substring(7);
  if (!authHeader)
    throw new UnauthorizedError('revoked_token', {
      message: `[401] Unauthorized. Invalid token.`,
    });
  const decodeInfo = jwt.verify(authHeader, SECRET) as {
    username: string;
    id: string;
    iat: number;
  };
  const user = await Storage.getUser({ id: decodeInfo.id }, true);
  console.log(user);
  if (!user?.isVerified)
    throw new UnauthorizedError('revoked_token', {
      message: `[401] Unauthorized. Invalid token.`,
    });
});

scraperRouter.post('/topics/:id', async (req, res) => {
  const topicID = req.params.id;
  const {
    body,
  }: {
    body: Pick<
      Topic,
      'title' | 'authorName' | 'authorID' | 'content' | 'createTime' | 'topicID' | 'lastFetchTime'
    >;
  } = req;
  await Storage.Scraper.updateTopicInfo(topicID, body);
});

export default scraperRouter;
