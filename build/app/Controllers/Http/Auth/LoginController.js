"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Auth/LoginValidator"));
class LoginController {
    async login({ request, response, auth }) {
        const data = await request.validate(LoginValidator_1.default);
        const token = await auth.use('jwt').attempt(data.email, data.password);
        return response.json({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });
    }
    async refresh({ auth, request, response }) {
        const refreshToken = request.input("refresh_token");
        const token = await auth.use("jwt").loginViaRefreshToken(refreshToken);
        return response.json({
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });
    }
    async logout({ auth, response }) {
        await auth.use('jwt').revoke();
        return response.status(200);
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map