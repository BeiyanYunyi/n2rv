import { Container, FormControlLabel, Grid, Switch, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../../src/types/Topic';
import TopicTableMobile from '../components/TopicTable/TopicTableMobile';
import TopicTablePC from '../components/TopicTable/TopicTablePC';

const IndexPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [topicList, setTopicList] = React.useState<TopicWhileGetAll[]>([]);
  const [needDeleted, setNeedDeleted] = React.useState(false);
  const [needElite, setNeedElite] = React.useState(false);
  const [needOriginal, setNeedOriginal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  React.useEffect(() => {
    document.title = '影之避难所';
  }, []);
  React.useEffect(() => {
    apiWrapper.getTopics({ page, needDeleted, needElite, needOriginal }).then((res) => {
      setLastPage(res.pages);
      setTopicList(res.topicList);
      setLoading(false);
    });
  }, [page, needDeleted, needElite, needOriginal]);
  const topicTableProps = {
    topicList,
    needDeleted,
    setNeedDeleted,
    loading,
    setLoading,
    page,
    setPage,
    lastPage,
  };
  return (
    <Container>
      <Grid container justifyContent="center" direction="row">
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={needDeleted}
                onChange={() => {
                  setNeedDeleted((oriState) => !oriState);
                }}
              />
            }
            label="已删帖"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={needElite}
                onChange={() => {
                  setNeedElite((oriState) => !oriState);
                }}
              />
            }
            label="精品"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={needOriginal}
                onChange={() => {
                  setNeedOriginal((oriState) => !oriState);
                }}
              />
            }
            label="避难所帖"
          />
        </Grid>
      </Grid>
      {isMobile ? <TopicTableMobile {...topicTableProps} /> : <TopicTablePC {...topicTableProps} />}
    </Container>
  );
};

export default IndexPage;
