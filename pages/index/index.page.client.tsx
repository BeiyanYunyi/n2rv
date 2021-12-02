import { Skeleton, Typography } from '@mui/material';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Root from './components/Root';

const SearchPage = lazy(() => import('./pages/SearchPage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const IndexPage = lazy(() => import('./pages/IndexPage'));

const Page = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route
          path="search/topics"
          element={
            <Suspense fallback={<Skeleton />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="topic/:topicId"
          element={
            <Suspense fallback={<Skeleton />}>
              <TopicPage />
            </Suspense>
          }
        />
        <Route
          index
          element={
            <Suspense fallback={<Typography>网页加载中</Typography>}>
              <IndexPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </Router>
);

ReactDOM.render(<Page />, window.document.getElementById('page-view'));

export default Page;
