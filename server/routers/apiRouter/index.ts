import express from 'express';
import Storage from '../../storageProviders/Storage';
import Topic from '../../../types/Topic';
import errorHandler from '../../middlewares/errorHandler';
import localRepliesRouter from './localRepliesRouter';
import localTopicsRouter from './localTopicsRouter';
import localUploadRouter from './localUploadRouter';
import loginRouter from './loginRouter';
import usersRouter from './usersRouter';
import scraperRouter from './scraperRouter';

require('express-async-errors');

const apiRouter = express.Router();

apiRouter.use('/localUpload', localUploadRouter);

apiRouter.use(express.json());

apiRouter.use('/scraper', scraperRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', loginRouter);
apiRouter.use('/localTopic', localTopicsRouter);
apiRouter.use('/localReply', localRepliesRouter);

apiRouter.get('/topic/:id', async (req, res) => {
  const topic = (await Storage.getTopic(req.params.id)) as Topic;
  const comments = await Storage.getComments(req.params.id);
  res.send({ topic, comments });
});

apiRouter.get('/topic', async (req, res) => {
  const { page, needDeleted, needElite, needOriginal } = req.query as {
    page: string | undefined;
    needDeleted: string | undefined;
    needElite: string | undefined;
    needOriginal: string | undefined;
  };
  const pages = await Storage.getPages({
    deleted: !!needDeleted,
    elite: !!needElite,
    original: !!needOriginal,
  });
  if (!page) {
    const topicList = await Storage.getAllTopics({
      skip: 0,
      limit: 50,
      needDeleted: !!needDeleted,
      needElite: !!needElite,
      needOriginal: !!needOriginal,
    });
    return res.send({ topicList, pages });
  }
  const pageNum = Number(page) * 50;
  const topicList = await Storage.getAllTopics({
    skip: pageNum,
    limit: 50,
    needDeleted: !!needDeleted,
    needElite: !!needElite,
    needOriginal: !!needOriginal,
  });
  return res.send({ topicList, pages });
});

apiRouter.get('/search/topics', async (req, res) => {
  const { query } = req.query as { query: string | undefined };
  if (query) {
    const topicList = await Storage.fullTextQueryTopic(query);
    return res.send(topicList);
  }
  return res.status(400).end();
});

apiRouter.use(errorHandler);

export default apiRouter;
