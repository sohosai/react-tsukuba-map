import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'ReactTsukubaMap',
      fileName: 'react-tsukuba-map',
    },
    rollupOptions: {
      external: ['react'], // バンドルしたくない依存関係を指定
      output: {
        globals: {
          react: 'React', // UMDビルド時に、external指定した依存関係をscript タグで読み込まれた場合に使用される変数名を指定
        },
      },
    },
  },
})
