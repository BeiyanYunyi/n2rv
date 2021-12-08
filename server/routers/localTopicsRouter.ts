import express from 'express';
import expressJwt from 'express-jwt';
import { v5 as uuidv5 } from 'uuid';
import config from '../../config/config.json';
import Storage from '../storageProviders/Storage';
import AnonymousNotAllowedError from '../errors/AnonymousNotAllowedError';
import expressjwtOptions from '../utils/expressJwtConstructor';

require('express-async-errors');

const localTopicsRouter = express.Router();

localTopicsRouter.post('/anonymous', async (req, res) => {
  if (!config.allowAnonymous) throw new AnonymousNotAllowedError('Anonymous is not allowed!');
  const { body } = req as {
    body: {
      authorName: string | undefined;
      content: string | undefined;
      title: string | undefined;
    };
  };
  if (!body.authorName || !body.content || !body.title) {
    return res.status(400).json({ error: 'invalid request' });
  }
  const topicToInsert = {
    authorName: body.authorName,
    content: body.content,
    title: body.title,
    authorID: uuidv5(body.authorName, config.uuidv5Namespace),
  };
  const topic = await Storage.insertNewTopic(topicToInsert);
  return res.json({ topic });
});

localTopicsRouter.use(expressJwt(expressjwtOptions));

localTopicsRouter.post('/', async (req, res) => {
  const { body } = req as {
    body: {
      content: string | undefined;
      title: string | undefined;
    };
  };
  if (!body.content || !body.title) {
    return res.status(400).json({ error: 'invalid request' });
  }
  const topicToInsert = {
    authorName: req.user.username,
    content: body.content,
    title: body.title,
    authorID: req.user.id,
  };
  const topic = await Storage.insertNewTopic(topicToInsert);
  return res.json({ topic });
});

export default localTopicsRouter;
