import React from 'react';
import './PageWrapper.css';
import type { PageContext } from './types';
import { PageContextProvider } from './usePageContext';

const PageWrapper = ({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
  </React.StrictMode>
);

export default PageWrapper;
