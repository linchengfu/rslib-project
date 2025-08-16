import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
    outDir: process.env.VERCEL ? path.resolve(__dirname, '../dist') : 'dist', // Vercel 输出到项目根目录的 dist，其他输出到 examples/dist
    emptyOutDir: true, // 构建前清空输出目录
  },
});
