import { escapeInject } from 'vite-plugin-ssr';
import logoUrl from '../../renderer/logo.svg';

/* eslint-disable import/prefer-default-export */

export const render = () => escapeInject`<html>
<head>
  <meta charset="UTF-8" />
  <title>影之避难所</title>
  <link rel="icon" href="${logoUrl}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div id="app-root"/>
</body>
</html>`;
