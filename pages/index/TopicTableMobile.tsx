import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MessageIcon from '@mui/icons-material/Message';
import { Card, CardHeader, Chip, Fab, Stack, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import UserFace from '../../renderer/components/UserFace';
import apiWrapper from '../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../src/types/Topic';

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
    apiWrapper.getAllTopics(page).then((res) => {
      setTopicList(res);
      setLoading(false);
    });
  }, [page]);

  const processedData = React.useMemo(
    () =>
      topicList.map((ele) => ({
        ...ele,
        lastReplyTime: ele.lastReplyTime ? format(Number(ele.lastReplyTime) * 1000, 'yy-MM-dd HH:mm') : '',
      })),
    [topicList],
  );

  return (
    <>
      <Stack spacing={1}>
        {processedData.map((topic) => (
          <Card key={topic.topicID}>
            <CardHeader
              title={topic.title}
              subheader={
                <>
                  <Typography variant="caption">{topic.authorName}</Typography>
                </>
              }
              avatar={<UserFace authorID={topic.authorID} authorName={topic.authorName} />}
              action={
                <Chip
                  label={topic.reply}
                  style={{ paddingLeft: 4 }}
                  size="small"
                  icon={<MessageIcon />}
                  variant="outlined"
                  color="info"
                />
              }
            />
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
