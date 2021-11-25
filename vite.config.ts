import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { searchForWorkspaceRoot, UserConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import ssr from 'vite-plugin-ssr/plugin';

const config: UserConfig = {
  publicDir: 'static',
  server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '.'] } },
  plugins: [
    react(),
    ssr(),
    VitePWA({
      mode: 'production',
      base: '/',
      registerType: 'autoUpdate',
    }),
    replace({
      preventAssignment: true,
      __DATE__: new Date().toISOString(),
    }),
  ],
  build: {
    rollupOptions: {
      /*
      output: {
        manualChunks(id) {
          if (id.includes('@mui')) {
            return 'mui';
          }
        },
      },
      */
    },
  },
};

export default config;
