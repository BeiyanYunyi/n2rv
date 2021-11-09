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
import Waline from '@waline/client';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../../config/config.json';
import UserFace from '../../renderer/components/UserFace';
import parserOpt from '../../renderer/utils/parserOpt';
import apiWrapper from '../../renderer/wrapper/apiWrapper';
import Reply from '../../src/types/Reply';
import Topic from '../../src/types/Topic';
import Comments from './components/Comments';

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
  lastReplyTime: '',
  deleteTime: null,
};

const Page = () => {
  const [topic, setTopic] = React.useState<Topic>(initialTopic);
  const [comments, setComments] = React.useState<Reply[]>([]);
  React.useEffect(() => {
    Waline({ el: '#waline', serverURL: config.walineURL });
  }, []);
  React.useEffect(() => {
    apiWrapper.getTopic(window.location.pathname.split('/')[2]).then((res) => {
      setTopic(res.topic);
      setComments(res.comments);
    });
  }, []);

  return (
    <Container>
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => {
            window.history.back();
          }}
          variant="outlined"
        >
          返回
        </Button>
        <>
          <Button
            href={`https://www.douban.com/group/topic/${topic.topicID}`}
            variant="outlined"
            disabled={!!topic.deleteTime}
          >
            原帖
          </Button>
          {topic.deleteTime && (
            <Typography variant="caption" style={{ alignItems: 'center', display: 'flex' }}>
              在{format(Math.abs(topic.deleteTime) * 1000, 'yyyy-MM-dd HH:mm:ss')}前已被删除
            </Typography>
          )}
        </>
      </Stack>
      <Card style={{ marginBottom: 8, marginTop: 8 }}>
        <Typography variant="h5" style={{ margin: 8 }}>
          {topic.title}
        </Typography>
        <CardHeader
          avatar={<UserFace authorID={topic.authorID} authorName={topic.authorName} />}
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
      <div id="waline" />
    </Container>
  );
};

export default Page;

ReactDOM.render(<Page />, window.document.getElementById('page-view'));
