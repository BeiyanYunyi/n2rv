import { Skeleton } from '@mui/material';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import TopicPage from './pages/TopicPage';

const SearchPage = lazy(() => import('./pages/SearchPage'));

const Page = () => (
  <Router>
    <Routes>
      <Route
        path="/search/topics"
        element={
          <Suspense fallback={<Skeleton />}>
            <SearchPage />
          </Suspense>
        }
      />
      <Route path="/topic/:topicId" element={<TopicPage />} />
      <Route path="/" element={<IndexPage />} />
    </Routes>
  </Router>
);

ReactDOM.render(<Page />, window.document.getElementById('page-view'));

export default Page;
