import { Container, FormControlLabel, Grid, Switch, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import TopicTableMobile from '../components/TopicTable/TopicTableMobile';
import TopicTablePC from '../components/TopicTable/TopicTablePC';
import { fetchTopics, setNeedDeleted, setNeedElite, setNeedOriginal } from '../redux/pageSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

const IndexPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { page, needDeleted, needElite, needOriginal } = useAppSelector((state) => state.page);
  React.useEffect(() => {
    document.title = '影之避难所';
  }, []);
  React.useEffect(() => {
    dispatch(fetchTopics());
  }, [page, dispatch, needDeleted, needElite, needOriginal]);
  return (
    <Container>
      <Grid container justifyContent="center" direction="row">
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={needDeleted}
                onChange={() => {
                  dispatch(setNeedDeleted(!needDeleted));
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
                  dispatch(setNeedElite(!needElite));
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
                  dispatch(setNeedOriginal(!needOriginal));
                }}
              />
            }
            label="避难所帖"
          />
        </Grid>
      </Grid>
      {isMobile ? <TopicTableMobile /> : <TopicTablePC />}
    </Container>
  );
};

export default IndexPage;
