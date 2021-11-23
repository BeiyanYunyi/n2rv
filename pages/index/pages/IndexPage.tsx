import {
  Button,
  Container,
  FormControlLabel,
  Stack,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../../src/types/Topic';
import AppWaline from '../components/AppWaline';
import TopicTableMobile from '../components/TopicTable/TopicTableMobile';
import TopicTablePC from '../components/TopicTable/TopicTablePC';

const IndexPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [topicList, setTopicList] = React.useState<TopicWhileGetAll[]>([]);
  const [needDeleted, setNeedDeleted] = React.useState(false);
  const [needElite, setNeedElite] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const navigate = useNavigate();
  React.useEffect(() => {
    document.title = '影之避难所';
  }, []);
  React.useEffect(() => {
    apiWrapper.getTopics(page, needDeleted, needElite).then((res) => {
      setLastPage(res.pages);
      setTopicList(res.topicList);
      setLoading(false);
    });
  }, [page, needDeleted, needElite]);
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
      <Stack justifyContent="center" direction="row">
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
        <Button
          onClick={() => {
            navigate('/search/topics');
          }}
        >
          搜索
        </Button>
      </Stack>
      {isMobile ? (
        <TopicTableMobile {...topicTableProps} />
      ) : (
        <TopicTablePC {...topicTableProps} />
      )}
      <AppWaline />
    </Container>
  );
};

export default IndexPage;
