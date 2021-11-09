/* eslint-disable jsx-a11y/alt-text */
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import parse from 'html-react-parser';
import React from 'react';
import ImgView from '../../../renderer/components/ImgView';
import UserFace from '../../../renderer/components/UserFace';
import Reply from '../../../src/types/Reply';

const CommentQuote = ({ reply }: { reply: Reply }) => (
  <Card style={{ margin: 8, marginBottom: 0 }} variant="outlined">
    <CardHeader
      avatar={<UserFace authorID={reply.quotingAuthorID!} authorName={reply.quotingAuthorName!} />}
      title={reply.quotingAuthorName}
    />
    <CardContent style={{ padding: 8, paddingTop: 0 }}>
      {reply.quotingImage && <ImgView src={`/cors/${reply.quotingImage}`} />}
      {reply.quotingText && (
        <Typography component="div" variant="caption">
          {parse(reply.quotingText)}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default CommentQuote;
