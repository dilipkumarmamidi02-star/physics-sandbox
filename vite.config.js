import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: './',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ]
  },

  build: {
    target: 'es2020',

    chunkSizeWarningLimit: 1200,

    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': [
            'react',
            'react-dom',
            'react-router-dom'
          ],

          'firebase-core': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore'
          ],

          framer: [
            'framer-motion'
          ],

          agora: [
            'agora-rtc-sdk-ng'
          ]
        }
      }
    }
  }
})
