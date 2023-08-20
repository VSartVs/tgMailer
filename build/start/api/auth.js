"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
function authRoutes() {
    Route_1.default.group(() => {
        Route_1.default.post('login', 'Auth/LoginController.login').as('login');
        Route_1.default.post('refresh/token', 'Auth/LoginController.refresh').as('refresh');
        Route_1.default.post('logout', 'Auth/LoginController.logout').as('logout').middleware('auth');
    });
}
exports.default = authRoutes;
//# sourceMappingURL=auth.js.map