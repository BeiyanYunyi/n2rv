import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import ssr from 'vite-plugin-ssr/plugin';
import { searchForWorkspaceRoot, UserConfig } from 'vite';

const config: UserConfig = {
  server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '.'] } },
  plugins: [
    react(),
    ssr(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui')) {
            return 'mui';
          }
        },
      },
    },
  },
};

export default config;
