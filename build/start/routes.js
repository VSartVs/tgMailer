"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const auth_1 = __importDefault(require("./api/auth"));
const admin_1 = __importDefault(require("./api/admin"));
Route_1.default.group(() => {
    (0, auth_1.default)();
    (0, admin_1.default)();
}).prefix('api/v1/');
Route_1.default.get('*', async ({ view }) => {
    return view.render('app');
});
//# sourceMappingURL=routes.js.map