/* eslint-disable jsx-a11y/alt-text */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import Reply from '../../../src/types/Reply';
import ImgView from './ImgView';
import UserFace from './UserFace';

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
