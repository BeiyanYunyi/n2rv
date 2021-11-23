import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import Topic from '../../../src/types/Topic';
import TopicElement from '../components/TopicTable/TopicElement';

const SearchPage = () => {
  const [searchStr, setSearchStr] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const search = async () => {
    setLoading(true);
    setTopics([]);
    const topicGetted = await apiWrapper.searchTopic(searchStr, 1);
    setTopics(topicGetted);
    setLoading(false);
  };
  return (
    <Container>
      <Button
        onClick={() => {
          navigate('/');
        }}
      >
        返回
      </Button>
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
          <TopicElement topic={topic} key={topic.topicID} />
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
