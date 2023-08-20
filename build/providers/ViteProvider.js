"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fs_1 = require("fs");
class ViteProvider {
    constructor(app) {
        this.app = app;
    }
    async boot() {
        const View = this.app.container.resolveBinding('Adonis/Core/View');
        const served = () => {
            const port = Env_1.default.get('VITE_PORT', 3000);
            return `
      <script type="module" src="http://localhost:${port}/@vite/client"></script>
      <script type="module" src="http://localhost:${port}/resources/js/app.ts" ></script>
    `;
        };
        const built = () => {
            const data = (0, fs_1.readFileSync)('./public/build/manifest.json').toString();
            const manifest = JSON.parse(data);
            return `<script type="module" src="/build/${manifest['resources/js/app.ts']['file']}"></script>`;
        };
        View.registerTag({
            tagName: 'vite',
            seekable: false,
            block: false,
            compile(_, buffer) {
                buffer.outputRaw(Env_1.default.get('NODE_ENV') === 'development' ? served() : built());
            },
        });
    }
}
exports.default = ViteProvider;
ViteProvider.needsApplication = true;
//# sourceMappingURL=ViteProvider.js.map