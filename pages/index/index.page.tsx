import React from 'react';
import { Counter } from './Counter';

const Page = () => (
  <>
    <h1>Welcome</h1>
    This page is:
    <ul>
      <li>Rendered to HTML.</li>
      <li>
        Interactive. <Counter />
      </li>
    </ul>
  </>
);

export { Page };
