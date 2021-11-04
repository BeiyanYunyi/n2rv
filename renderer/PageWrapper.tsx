import React from 'react';
import './PageWrapper.css';
import type { PageContext } from './types';
import { PageContextProvider } from './usePageContext';

const Content = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 20,
      paddingBottom: 50,
      borderLeft: '2px solid #eee',
      minHeight: '100vh',
    }}
  >
    {children}
  </div>
);

const PageWrapper = ({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      <Content>{children}</Content>
    </PageContextProvider>
  </React.StrictMode>
);

export default PageWrapper;
