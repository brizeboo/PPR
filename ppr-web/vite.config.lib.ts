import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    target: 'es2020',
    lib: {
      entry: fileURLToPath(new URL('./src/embed/entry.ts', import.meta.url)),
      name: 'PPR',
      fileName: 'ppr-renderer',
      formats: ['umd'],
    },
    rollupOptions: {
      // Don't externalize vue or element-plus so it's fully self-contained
      // external: ['vue'], 
    },
  },
})
