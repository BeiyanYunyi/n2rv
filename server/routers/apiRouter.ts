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
  const { page, needDeleted } = req.query as {
    page: string | undefined;
    needDeleted: string | undefined;
  };
  const pages = needDeleted ? await Storage.getDeletedPages() : await Storage.getPages();
  if (!page) {
    const topicList = needDeleted
      ? await Storage.getDeletedTopics(0, 50)
      : await Storage.getAllTopics(0, 50);
    return res.send({ topicList, pages });
  }
  const pageNum = Number(page) * 50;
  const topicList = needDeleted
    ? await Storage.getDeletedTopics(pageNum, 50)
    : await Storage.getAllTopics(pageNum, 50);
  return res.send({ topicList, pages });
});

export default apiRouter;
