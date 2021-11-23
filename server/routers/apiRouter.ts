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
  const { page, needDeleted, needElite } = req.query as {
    page: string | undefined;
    needDeleted: string | undefined;
    needElite: string | undefined;
  };
  const pages = await Storage.getPages(!!needDeleted, !!needElite);
  if (!page) {
    const topicList = await Storage.getAllTopics(0, 50, !!needDeleted, !!needElite);
    return res.send({ topicList, pages });
  }
  const pageNum = Number(page) * 50;
  const topicList = await Storage.getAllTopics(pageNum, 50, !!needDeleted, !!needElite);
  return res.send({ topicList, pages });
});

apiRouter.get('/search/topics', async (req, res) => {
  const { query, page } = req.query as { query: string | undefined; page: string | undefined };
  if (query && !Number.isNaN(Number(page))) {
    const pageNum = Number(page) * 50;
    const topicList = await Storage.fullTextQueryTopic(query, pageNum, 50);
    return res.send(topicList);
  }
  return res.status(400).end();
});

export default apiRouter;
