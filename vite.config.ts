import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendPort = env.PORT || env.BACKEND_PORT || '3001';
  const backendTarget = env.VITE_API_TARGET || `http://localhost:${backendPort}`;
  const devPort = Number(env.VITE_PORT) || 3000;
  const previewPort = Number(env.VITE_PREVIEW_PORT) || 4173;

  const apiProxyConfig = {
    target: backendTarget,
    changeOrigin: true,
    secure: false,
  };

  return {
    base: './',
    plugins: [react(), viteSingleFile()],
    server: {
      port: devPort,
      proxy: {
        '/api': apiProxyConfig,
      },
    },
    preview: {
      port: previewPort,
      proxy: {
        '/api': apiProxyConfig,
      },
    },
    test: {
      globals: true,
      environment: 'node',
    },
  };
});
