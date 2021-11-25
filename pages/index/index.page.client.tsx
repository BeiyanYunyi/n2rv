import Skeleton from '@mui/material/Skeleton';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import ReloadPrompt from './components/ReloadPrompt';
import IndexPage from './pages/IndexPage';
import TopicPage from './pages/TopicPage';

const SearchPage = lazy(() => import('./pages/SearchPage'));

const Page = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Outlet />
            <ReloadPrompt />
          </>
        }
      >
        <Route
          path="search/topics"
          element={
            <Suspense fallback={<Skeleton />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route path="topic/:topicId" element={<TopicPage />} />
        <Route path="" element={<IndexPage />} />
      </Route>
    </Routes>
  </Router>
);

ReactDOM.render(<Page />, window.document.getElementById('page-view'));

export default Page;
