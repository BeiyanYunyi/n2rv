/* eslint-disable jsx-a11y/alt-text */
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import parse from 'html-react-parser';
import React from 'react';
import Reply from '../../../src/types/Reply';
import UserFace from './UserFace';

const CommentQuote = ({ reply }: { reply: Reply }) => (
  <Card style={{ margin: 8, marginBottom: 0 }}>
    <CardHeader
      avatar={<UserFace authorID={reply.quotingAuthorID!} authorName={reply.quotingAuthorName!} />}
      title={reply.quotingAuthorName}
    />
    <CardContent style={{ padding: 8, paddingTop: 0 }}>
      {reply.quotingImage && (
        <div className="quote-img">
          <img data-orig={reply.quotingImage} src={`/cors/${reply.quotingImage}`} />
        </div>
      )}
      {reply.quotingText && (
        <Typography component="div" variant="caption">
          {parse(reply.quotingText)}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default CommentQuote;
