import { Container } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import TopicTable from './TopicTable';

const Page = () => (
  <Container>
    <TopicTable />
  </Container>
);

ReactDOM.render(<Page />, window.document.querySelector('div#app-root'));

export default Page;
