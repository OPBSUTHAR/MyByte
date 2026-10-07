import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// MyByte — React build for Vercel.
// The zero-build static site still lives at the repo root for GitHub Pages.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion'],
          three: ['three', '@react-three/fiber'],
          pixi: ['pixi.js'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
