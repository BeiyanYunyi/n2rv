import { PageContextBuiltIn } from 'vite-plugin-ssr';
import { PageContext } from '../../renderer/types';

export default (pageContext: PageContextBuiltIn & PageContext) => {
  const { url } = pageContext;
  switch (url) {
    case '/about':
      return false;
    case '/assets':
      return false;
    default:
      return true;
  }
};
