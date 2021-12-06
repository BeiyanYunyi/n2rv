import express from 'express';
import expressJwt from 'express-jwt';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import config from '../../config/config.json';
import Storage from '../../src/instances/Storage';
import Reply from '../../src/types/Reply';
import AnonymousNotAllowedError from '../errors/AnonymousNotAllowedError';
import expressjwtOptions from '../utils/expressJwtConstructor';

require('express-async-errors');

const insertReply = async (body: {
  quotingID: string | undefined;
  topicID: string;
  authorID: string;
  content: string;
  authorName: string;
}) => {
  const replyTime = Math.floor(Date.now() / 1000);
  let quotingImage: string | null = null;
  let quotingText: string | null = null;
  let quotingAuthorID: string | null = null;
  let quotingAuthorName: string | null = null;
  if (body.quotingID) {
    const quotingReply = await Storage.getComment(body.quotingID);
    if (quotingReply) {
      quotingImage = quotingReply.image;
      quotingText = quotingReply.content;
      quotingAuthorID = quotingReply.authorID;
      quotingAuthorName = quotingReply.authorName;
    }
  }
  const replyToInsert: Reply = {
    replyID: uuidv4(),
    topicID: body.topicID,
    authorID: body.authorID,
    content: body.content,
    image: null,
    votes: 0,
    authorName: body.authorName,
    isPoster: false,
    replyTime,
    quoting: !!body.quotingID,
    quotingAuthorID,
    quotingAuthorName,
    quotingText,
    quotingImage,
  };
  return Storage.insertReply(replyToInsert);
};

const localRepliesRouter = express.Router();

localRepliesRouter.post('/anonymous', async (req, res) => {
  if (!config.allowAnonymous) throw new AnonymousNotAllowedError('Anonymous is not allowed!');
  const { body } = req as {
    body: Pick<Reply, 'content' | 'topicID' | 'authorName'> & { quotingID: string | undefined };
  };
  if (!body.authorName || !body.content || !body.topicID) {
    return res.status(400).json({ error: 'invalid request' });
  }
  const authorID = uuidv5(body.authorName, config.uuidv5Namespace);
  const replyToReturn = await insertReply({
    quotingID: body.quotingID,
    topicID: body.topicID,
    authorID,
    content: body.content,
    authorName: body.authorName,
  });
  return res.json(replyToReturn);
});

localRepliesRouter.use(expressJwt(expressjwtOptions));

localRepliesRouter.post('/', async (req, res) => {
  const { body } = req as {
    body: Pick<Reply, 'content' | 'topicID'> & { quotingID: string | undefined };
  };
  if (!body.content || !body.topicID) {
    return res.status(400).json({ error: 'invalid request' });
  }
  const replyToReturn = await insertReply({
    quotingID: body.quotingID,
    topicID: body.topicID,
    authorID: req.user.id,
    authorName: req.user.username,
    content: body.content,
  });
  return res.json(replyToReturn);
});

export default localRepliesRouter;
