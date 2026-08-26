import { defineConfig } from 'vite';

export default defineConfig({
  root: 'site',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
