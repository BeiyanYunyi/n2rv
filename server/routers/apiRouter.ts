import express from 'express';
import Storage from '../../src/instances/Storage';
import Topic from '../../src/types/Topic';

require('express-async-errors');

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get('/topic/:id', async (req, res) => {
  const topic = (await Storage.getTopic(req.params.id)) as Topic;
  const comments = await Storage.getComments(req.params.id);
  res.send({ topic, comments });
});

apiRouter.get('/topic', async (req, res) => {
  const { page } = req.query as { page: string | undefined };
  if (!page) {
    const topicList = await Storage.getAllTopics(0, 50);
    return res.send(topicList);
  }
  const pageNum = Number(page) * 50;
  const topicList = await Storage.getAllTopics(pageNum, 50);
  return res.send(topicList);
});

apiRouter.get('/pages', async (req, res) => {
  const pages = await Storage.getPages();
  res.send({ pages });
});

export default apiRouter;
