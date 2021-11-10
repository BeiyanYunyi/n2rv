import { PageContextBuiltIn } from 'vite-plugin-ssr';
import { PageContext } from '../../renderer/types';

export default (pageContext: PageContextBuiltIn & PageContext) => {
  const { url } = pageContext;
  if (url === '/about') return false;
  return true;
};
