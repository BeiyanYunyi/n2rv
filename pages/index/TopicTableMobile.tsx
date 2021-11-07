import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Fab,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { stringToColor } from '../../renderer/utils/stringAvatar';
import apiWrapper from '../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../src/types/Topic';
import ReplyChip from './components/ReplyChip';
import formatLastReplyTime from './utils/formatLastReplyTime';

const TopicTableMobile = () => {
  const [topicList, setTopicList] = React.useState<TopicWhileGetAll[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const theme = useTheme();

  React.useEffect(() => {
    apiWrapper.getPages().then((res) => setLastPage(res));
  }, []);

  React.useEffect(() => {
    apiWrapper.getTopics(page).then((res) => {
      setTopicList(res);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Stack spacing={1}>
        {topicList.map((topic) => (
          <Card key={topic.topicID}>
            <CardActionArea
              onClick={() => {
                window.location.href = `topic/${topic.topicID}`;
              }}
            >
              <Stack direction="row" alignItems="center">
                <ReplyChip reply={topic.reply} />
                <div>
                  <CardHeader
                    style={{ paddingBottom: 0, paddingLeft: 8 }}
                    title={<Typography variant="h6">{topic.title}</Typography>}
                  />
                  <CardContent style={{ paddingTop: 0, paddingLeft: 8 }}>
                    <Stack direction="row" spacing={1}>
                      <Avatar sx={{ bgcolor: stringToColor(topic.authorName), height: 20, width: 20 }}>
                        <Typography style={{ color: theme.palette.info.contrastText }} variant="caption">
                          {topic.authorName.substring(0, 1)}
                        </Typography>
                      </Avatar>
                      <Typography variant="caption" style={{ color: 'rgba(0,0,0,0.6)' }}>
                        {topic.authorName}
                      </Typography>
                      <Typography variant="caption" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        {topic.lastReplyTime && formatLastReplyTime(topic.lastReplyTime)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </div>
              </Stack>
            </CardActionArea>
          </Card>
        ))}

        <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Stack alignItems="center" spacing={1}>
            <Fab
              style={
                loading || page === 1
                  ? undefined
                  : { backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }
              }
              disabled={loading || page === 1}
              size="small"
              onClick={
                page !== 1
                  ? () => {
                      setLoading(true);
                      setPage((oriPage) => oriPage - 1);
                    }
                  : undefined
              }
            >
              <ArrowBackIcon />
            </Fab>
            <Chip color="warning" size="small" label={`${page} / ${lastPage}`} />
            <Fab
              style={
                loading || page >= lastPage
                  ? undefined
                  : { backgroundColor: theme.palette.success.light, color: theme.palette.success.contrastText }
              }
              color="primary"
              size="small"
              disabled={loading || page >= lastPage}
              onClick={
                page < lastPage
                  ? () => {
                      setLoading(true);
                      setPage((oriPage) => oriPage + 1);
                    }
                  : undefined
              }
            >
              <ArrowForwardIcon />
            </Fab>
          </Stack>
        </div>
      </Stack>
    </>
  );
};

export default TopicTableMobile;
