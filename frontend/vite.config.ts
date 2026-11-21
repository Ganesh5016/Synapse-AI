import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function safePublicCopy() {
  return {
    name: 'safe-public-copy',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(publicDir) && fs.existsSync(distDir)) {
        for (const file of fs.readdirSync(publicDir)) {
          if (file.toLowerCase() === 'desktop.ini' || file.startsWith('.')) continue;
          try {
            const src = path.resolve(publicDir, file);
            const dest = path.resolve(distDir, file);
            if (fs.statSync(src).isFile()) {
              fs.copyFileSync(src, dest);
            }
          } catch (e) {
            console.warn(`Could not copy ${file}:`, e);
          }
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), safePublicCopy()],
  build: {
    copyPublicDir: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});

