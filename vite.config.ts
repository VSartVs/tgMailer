import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import adonis from './helpers/adonis'


export default defineConfig(() => {

    return {
        plugins: [
            vue(),
            adonis({input: 'resources/js/app.ts'}),
        ],

        server: {
            host: '0.0.0.0',
            hmr: {
                host: 'localhost'
            }
        },

        resolve: {
            alias: {
                '~@coreui': path.resolve(__dirname, 'node_modules/@coreui'),
                '@assets': path.resolve(__dirname, 'resources/assets')
            }
        }
    }
})
