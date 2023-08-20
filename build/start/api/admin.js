"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
function adminRoutes() {
    Route_1.default.group(() => {
    }).prefix('admin/')
        .middleware('auth');
}
exports.default = adminRoutes;
//# sourceMappingURL=admin.js.map