import { Button, Card, CardContent, CardHeader, Chip, Container, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import React from 'react';
import Reply from '../../src/types/Reply';
import Topic from '../../src/types/Topic';
import Comments from './components/Comments';
import UserFace from './components/UserFace';

const Page = ({ topic, comments }: { topic: Topic; comments: Reply[] }) => (
  <Container>
    <Stack direction="row" spacing={1}>
      <Button href="../../" variant="outlined">
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
          <span>在{format(Math.abs(topic.deleteTime) * 1000, 'yyyy-MM-dd HH:mm:ss')}前已被删除</span>
        )}
      </>
    </Stack>
    <Card style={{ marginBottom: 8, marginTop: 8 }}>
      <Typography variant="h5" style={{ margin: 8 }}>
        {topic.title}
      </Typography>
      <CardHeader
        avatar={<UserFace authorID={topic.authorID} authorName={topic.authorName} />}
        title={topic.authorName}
        subheader={format(topic?.createTime! * 1000, 'yyyy-MM-dd HH:mm:ss')}
        action={
          <>
            <Chip label="楼主" color="primary" size="small" variant="outlined" style={{ marginRight: 8 }} />
            <Chip label="# 1" size="small" variant="outlined" />
          </>
        }
      />
      <CardContent style={{ paddingTop: 0 }}>
        <Typography component="div">
          {topic?.content &&
            parse(
              topic.content
                .replaceAll('https://img', '/cors/https://img')
                .replaceAll('.webp', '.jpg')
                .replace('<br />', ''),
            )}
        </Typography>
      </CardContent>
    </Card>
    <Comments replies={comments} />
    <div id="walineWrapper" />
  </Container>
);

export default Page;
