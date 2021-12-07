/* eslint-disable jsx-a11y/alt-text */
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import format from 'date-fns/format';
import parse from 'html-react-parser';
import Reply from '../../../src/types/Reply';
import CommentQuote from './CommentQuote';
import ImgView from './ImgView';
import UserFace from './UserFace';
import { useReplyStateValue } from '../contexts/ReplyContext';
import parserOpt from '../../../renderer/utils/parserOpt';

const Comment = ({ reply, index }: { reply: Reply; index: number }) => {
  const [, replyDispatch] = useReplyStateValue();
  return (
    <Card>
      {reply.quoting && <CommentQuote reply={reply} />}
      <CardHeader
        avatar={<UserFace authorID={reply.authorID} authorName={reply.authorName} />}
        title={reply.authorName}
        subheader={format(reply.replyTime * 1000, 'yyyy-MM-dd HH:mm:ss')}
        action={
          <Stack direction="row" spacing={1}>
            {reply.isPoster && (
              <Chip label="楼主" color="primary" size="small" variant="outlined" />
            )}
            <Chip label={`# ${index}`} size="small" variant="outlined" />
          </Stack>
        }
      />
      <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {reply.image && <ImgView src={`/cors/${reply.image}`} />}
        <Typography component="div">{parse(reply.content, parserOpt)}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant="text" startIcon={<ThumbUpIcon fontSize="inherit" />} size="small" disabled>
          {reply.votes}
        </Button>
        <Button
          variant="text"
          startIcon={<ReplyIcon fontSize="inherit" />}
          onClick={() => {
            replyDispatch({ type: 'ReplyTo', payload: reply.replyID });
            window.scroll(0, document.body.scrollHeight);
          }}
        >
          回复
        </Button>
      </CardActions>
    </Card>
  );
};

const Comments = ({ replies }: { replies: Reply[] }) => (
  <Stack spacing={1}>
    {replies.map((reply, index) => (
      <Comment reply={reply} index={index + 2} key={reply.replyID.toString()} />
    ))}
  </Stack>
);

export default Comments;
