import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import { UserConfig } from 'vite';

const config: UserConfig = {
  server: { fs: { allow: ['.'] } },
  plugins: [react(), ssr()],
};

export default config;
