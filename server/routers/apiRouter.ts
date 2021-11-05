import express from 'express';
import Storage from '../../src/instances/Storage';

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get('/topics', async (req, res) => {
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
