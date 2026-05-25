import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-core': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'agora': ['agora-rtc-sdk-ng'],
          'framer': ['framer-motion'],
          'react-core': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
