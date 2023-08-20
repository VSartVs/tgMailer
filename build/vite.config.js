"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_vue_1 = __importDefault(require("@vitejs/plugin-vue"));
const path_1 = __importDefault(require("path"));
exports.default = (0, vite_1.defineConfig)(({ command }) => {
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
        plugins: [(0, plugin_vue_1.default)()],
        resolve: {
            alias: {
                '~@coreui': path_1.default.resolve(__dirname, 'node_modules/@coreui'),
                '@assets': path_1.default.resolve(__dirname, 'resources/assets')
            }
        }
    };
});
//# sourceMappingURL=vite.config.js.map