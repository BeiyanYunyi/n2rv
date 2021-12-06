import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import format from 'date-fns/format';
import parse from 'html-react-parser';
import React from 'react';
import { useParams } from 'react-router-dom';
import parserOpt from '../../../renderer/utils/parserOpt';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import Reply from '../../../src/types/Reply';
import Topic from '../../../src/types/Topic';
import Comments from '../components/Comments';
import ReplyToTopic from '../components/ReplyToTopic';
import UserFace from '../components/UserFace';
import { useReplyStateValue } from '../contexts/ReplyContext';

const initialTopic: Topic = {
  title: '',
  topicID: '',
  authorID: '',
  authorName: '',
  content: null,
  createTime: null,
  reply: '',
  lastFetchTime: 0,
  isElite: false,
  lastReplyTime: 0,
  deleteTime: null,
};

const TopicPage = () => {
  const params = useParams();
  const [topic, setTopic] = React.useState<Topic>(initialTopic);
  const [comments, setComments] = React.useState<Reply[]>([]);
  const [, replyStateDispatch] = useReplyStateValue();
  React.useEffect(() => {
    if (params.topicId) {
      apiWrapper.getTopic(params.topicId).then((res) => {
        setTopic(res.topic);
        setComments(res.comments);
        document.title = res.topic.title;
      });
      replyStateDispatch({ type: 'Cancel' });
    }
  }, [params.topicId, replyStateDispatch]);

  const isOriginal = !!topic.deleteTime && topic.deleteTime < 0;

  return (
    <Container>
      <Stack direction="row" spacing={1}>
        <>
          <Button
            href={`https://www.douban.com/group/topic/${topic.topicID}`}
            variant="outlined"
            rel="noreferrer"
            disabled={!!topic.deleteTime}
          >
            原帖
          </Button>
          {topic.deleteTime && (
            <Typography variant="caption" style={{ alignItems: 'center', display: 'flex' }}>
              {isOriginal && '这是一个原创帖'}
              {topic.deleteTime > 0 &&
                `在${format(Math.abs(topic.deleteTime) * 1000, 'yyyy-MM-dd HH:mm:ss')}前已被删除`}
            </Typography>
          )}
        </>
      </Stack>
      <Card style={{ marginBottom: 8, marginTop: 8 }}>
        <Typography variant="h5" style={{ margin: 8 }}>
          {topic.title}
        </Typography>
        <CardHeader
          avatar={
            <UserFace
              authorID={topic.authorID}
              authorName={topic.authorName}
              isOriginal={isOriginal}
            />
          }
          title={topic.authorName || <Skeleton />}
          subheader={
            topic.createTime ? format(topic.createTime * 1000, 'yyyy-MM-dd HH:mm:ss') : <Skeleton />
          }
          action={
            <>
              <Chip
                label="楼主"
                color="primary"
                size="small"
                variant="outlined"
                style={{ marginRight: 8 }}
              />
              <Chip label="# 1" size="small" variant="outlined" />
            </>
          }
        />
        <CardContent style={{ paddingTop: 0 }}>
          <Typography component="div">
            {topic.content === null ? (
              <Skeleton />
            ) : (
              topic.content &&
              parse(
                topic.content
                  .replaceAll('https://img', '/cors/https://img')
                  .replaceAll('.webp', '.jpg')
                  .replace('<br />', ''),
                parserOpt,
              )
            )}
          </Typography>
        </CardContent>
      </Card>
      <Comments replies={comments} />
      <ReplyToTopic setComments={setComments} topicID={params.topicId} />
    </Container>
  );
};

export default TopicPage;
