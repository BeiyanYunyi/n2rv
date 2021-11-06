import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import { searchForWorkspaceRoot, UserConfig } from 'vite';

const config: UserConfig = {
  server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '.'] } },
  plugins: [react(), ssr()],
};

export default config;
