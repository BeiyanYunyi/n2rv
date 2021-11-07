import { Container, FormControlLabel, Switch, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import apiWrapper from '../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../src/types/Topic';
import TopicTableMobile from './TopicTableMobile';
import TopicTablePC from './TopicTablePC';

const Page = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [topicList, setTopicList] = React.useState<TopicWhileGetAll[]>([]);
  const [needDeleted, setNeedDeleted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  React.useEffect(() => {
    apiWrapper.getTopics(page, needDeleted).then((res) => {
      setLastPage(res.pages);
      setTopicList(res.topicList);
      setLoading(false);
    });
  }, [page, needDeleted]);
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
      <div style={{ width: '100%', textAlign: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={needDeleted}
              onChange={() => {
                setNeedDeleted((oriState) => !oriState);
              }}
            />
          }
          label="只看被删的帖子"
        />
      </div>
      {isMobile ? <TopicTableMobile {...topicTableProps} /> : <TopicTablePC {...topicTableProps} />}
    </Container>
  );
};

ReactDOM.render(<Page />, window.document.getElementById('page-view'));

export default Page;
