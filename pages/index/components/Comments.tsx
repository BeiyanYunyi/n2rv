/* eslint-disable jsx-a11y/alt-text */
import { Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import format from 'date-fns/format';
import parse from 'html-react-parser';
import React from 'react';
import UserFace from '../../../renderer/components/UserFace';
import Reply from '../../../src/types/Reply';
import CommentQuote from './CommentQuote';
import ImgView from '../../../renderer/components/ImgView';

const Comment = ({ reply, index }: { reply: Reply; index: number }) => (
  <Card>
    {reply.quoting && <CommentQuote reply={reply} />}
    <CardHeader
      avatar={<UserFace authorID={reply.authorID} authorName={reply.authorName} />}
      title={reply.authorName}
      subheader={format(reply.replyTime * 1000, 'yyyy-MM-dd HH:mm:ss')}
      action={
        <Stack direction="row" spacing={1}>
          {reply.isPoster && <Chip label="楼主" color="primary" size="small" variant="outlined" />}
          <Chip label={`# ${index}`} size="small" variant="outlined" />
        </Stack>
      }
    />
    <CardContent style={{ paddingTop: 0 }}>
      {reply.image && <ImgView src={`/cors/${reply.image}`} />}
      <Typography component="div">{parse(reply.content)}</Typography>
    </CardContent>
  </Card>
);

const Comments = ({ replies }: { replies: Reply[] }) => (
  <Stack spacing={1}>
    {replies.map((reply, index) => (
      <Comment reply={reply} index={index + 2} key={reply.replyID.toString()} />
    ))}
  </Stack>
);

export default Comments;