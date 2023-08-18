import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
      manifest: true,
      outDir: 'public/build',
      rollupOptions: {
        input: 'resources/js/app.ts',
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
          '~@coreui': path.resolve(__dirname, 'node_modules/@coreui'),
          '@assets': path.resolve(__dirname, 'resources/assets')
      }
  }
  };
});
