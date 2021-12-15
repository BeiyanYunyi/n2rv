import SearchIcon from '@mui/icons-material/Search';
import { Container, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import AppSetStateAction from '../../../types/AppSetStateAction';
import { TopicWhileGetAll } from '../../../types/Topic';
import TopicElement from '../components/TopicTable/TopicElement';
import useScrollProgress from '../utils/useScrollProgress';

const MemorizedTopicElement = ({
  topics,
  searchStr,
  scrollProgress,
}: {
  topics: TopicWhileGetAll[];
  searchStr: string | undefined;
  scrollProgress: { save: () => void; load: () => void };
}) => {
  const navigate = useNavigate();
  return (
    <>
      {topics.map((topic) => (
        <TopicElement
          topic={topic}
          key={topic.topicID}
          onClick={(e) => {
            e.preventDefault();
            if (searchStr !== undefined) {
              sessionStorage.setItem('searchStr', searchStr);
            }
            sessionStorage.setItem('topics', JSON.stringify(topics));
            scrollProgress.save();
            navigate(`/topic/${topic.topicID}`);
          }}
        />
      ))}
    </>
  );
};

interface SearchBarRef {
  searchStr: string;
  setSearchStr: AppSetStateAction<string>;
}

const SearchBar = forwardRef(({ search }: { search: (str: string) => Promise<void> }, ref) => {
  const [searchStr, setSearchStr] = useState('');
  useImperativeHandle(ref, () => ({ searchStr, setSearchStr }));
  useEffect(() => {
    const searchStrStored = sessionStorage.getItem('searchStr');
    if (searchStrStored) setSearchStr(searchStrStored);
  }, []);
  return (
    <TextField
      onKeyPress={(e) => {
        if (e.code === 'Enter') search(searchStr);
      }}
      autoFocus
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                search(searchStr);
              }}
            >
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
  );
});

const SearchPage = () => {
  const [topics, setTopics] = useState<TopicWhileGetAll[]>([]);
  const [loading, setLoading] = useState(false);
  const searchBarRef = useRef<SearchBarRef>(null);

  const search = useMemo(
    () => async (str: string) => {
      setLoading(true);
      setTopics([]);
      const topicGetted = await apiWrapper.searchTopic(str, 1);
      setTopics(topicGetted);
      setLoading(false);
    },
    [],
  );

  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const topicsStored = sessionStorage.getItem('topics');
    if (topicsStored) setTopics(JSON.parse(topicsStored));
  }, []);

  return (
    <Container>
      <Stack spacing={1}>
        <SearchBar search={search} />
        <MemorizedTopicElement
          topics={topics}
          searchStr={searchBarRef.current?.searchStr}
          scrollProgress={scrollProgress}
        />
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
