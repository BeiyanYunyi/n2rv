import { Container, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import TopicTableMobile from './TopicTableMobile';
import TopicTablePC from './TopicTablePC';

const Page = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return <Container>{isMobile ? <TopicTableMobile /> : <TopicTablePC />}</Container>;
};

ReactDOM.render(<Page />, window.document.querySelector('div#app-root'));

export default Page;
