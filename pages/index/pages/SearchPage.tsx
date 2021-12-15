import SearchIcon from '@mui/icons-material/Search';
import { Container, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../../types/Topic';
import TopicElement from '../components/TopicTable/TopicElement';

const SearchPage = () => {
  const [searchStr, setSearchStr] = useState('');
  const [topics, setTopics] = useState<TopicWhileGetAll[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const search = async () => {
    setLoading(true);
    setTopics([]);
    const topicGetted = await apiWrapper.searchTopic(searchStr, 1);
    setTopics(topicGetted);
    setLoading(false);
  };

  useEffect(() => {
    const searchStrStored = sessionStorage.getItem('searchStr');
    const topicsStored = sessionStorage.getItem('topics');
    const scrollYStored = sessionStorage.getItem('searchScrollHeight');
    if (searchStrStored) setSearchStr(searchStrStored);
    if (topicsStored) setTopics(JSON.parse(topicsStored));
    // 应当等到下一事件循环再执行，否则无效
    if (scrollYStored)
      setTimeout(() => {
        window.scrollTo(0, Number(scrollYStored));
      }, 0);
  }, []);

  return (
    <Container>
      <Stack spacing={1}>
        <TextField
          onKeyPress={(e) => {
            if (e.code === 'Enter') search();
          }}
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={search}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          onChange={(e) => {
            setSearchStr(e.target.value);
          }}
          value={searchStr}
        />
        {topics.map((topic) => (
          <TopicElement
            topic={topic}
            key={topic.topicID}
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('searchStr', searchStr);
              sessionStorage.setItem('topics', JSON.stringify(topics));
              if (window.scrollY) {
                sessionStorage.setItem('searchScrollHeight', window.scrollY.toString());
              }
              navigate(`/topic/${topic.topicID}`);
            }}
          />
        ))}
        {loading && (
          <>
            <Skeleton variant="rectangular" height={92} />
            <Skeleton variant="rectangular" height={92} />
            <Skeleton variant="rectangular" height={92} />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default SearchPage;
