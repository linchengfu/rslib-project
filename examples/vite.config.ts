import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname, // 指定 examples 目录为根目录
  base: process.env.VERCEL
    ? '/'
    : process.env.NODE_ENV === 'production'
      ? '/rslib-project/'
      : '/',
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist', // 输出到 examples/dist 目录
    emptyOutDir: true, // 构建前清空输出目录
  },
});
