import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { PageContextBuiltIn } from 'vite-plugin-ssr';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';
import logoUrl from './logo.svg';
import PageWrapper from './PageWrapper';
import type { PageContext } from './types';

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname'];

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageWrapper pageContext={pageContext}>
      <Page {...pageProps} />
    </PageWrapper>,
  );

  // See https://vite-plugin-ssr.com/html-head
  const { documentProps } = pageContext;
  const title = documentProps?.title || 'Vite SSR app';
  const desc = documentProps?.description || 'App using Vite + vite-plugin-ssr';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here,
      // which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
