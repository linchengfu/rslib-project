import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname, // 指定 examples 目录为根目录
  plugins: [react()],
  server: {
    open: true,
  },
});
