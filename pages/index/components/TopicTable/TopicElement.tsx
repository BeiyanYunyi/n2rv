import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { stringToColor } from '../../../../renderer/utils/stringAvatar';
import { TopicWhileGetAll } from '../../../../src/types/Topic';
import formatLastReplyTime from '../../utils/formatLastReplyTime';
import ReplyChip from '../ReplyChip';

const TopicElement = ({ topic }: { topic: TopicWhileGetAll }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Card key={topic.topicID}>
      <CardActionArea
        href={`/topic/${topic.topicID}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/topic/${topic.topicID}`);
        }}
      >
        <Stack direction="row" alignItems="center">
          <ReplyChip reply={topic.reply} />
          <div>
            <CardHeader
              style={{ paddingBottom: 0, paddingLeft: 8 }}
              title={
                <Typography variant="h6">
                  {topic.isElite && (
                    <Chip label="精品" size="small" color="error" />
                  )}
                  {topic.title}
                </Typography>
              }
            />
            <CardContent style={{ paddingTop: 0, paddingLeft: 8 }}>
              <Stack direction="row" spacing={1}>
                <Avatar
                  sx={{
                    bgcolor: stringToColor(topic.authorName),
                    height: 20,
                    width: 20,
                  }}
                >
                  <Typography
                    style={{ color: theme.palette.info.contrastText }}
                    variant="caption"
                  >
                    {topic.authorName.substring(0, 1)}
                  </Typography>
                </Avatar>
                <Typography
                  variant="caption"
                  style={{ color: 'rgba(0,0,0,0.6)' }}
                >
                  {topic.authorName}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: 'rgba(0,0,0,0.4)' }}
                >
                  {topic.lastReplyTime &&
                    formatLastReplyTime(topic.lastReplyTime)}
                </Typography>
              </Stack>
            </CardContent>
          </div>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default TopicElement;
