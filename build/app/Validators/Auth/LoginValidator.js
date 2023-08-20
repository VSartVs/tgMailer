"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Rules_1 = require("@adonisjs/validator/build/src/Rules");
const CustomReporter_1 = global[Symbol.for('ioc.use')]("App/Validators/Reporters/CustomReporter");
class LoginValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.reporter = CustomReporter_1.CustomReporter;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [
                Rules_1.rules.required(),
                Rules_1.rules.email(),
                Rules_1.rules.exists({ table: 'users', column: 'email' }),
            ]),
            password: Validator_1.schema.string({}, [
                Rules_1.rules.required(),
                Rules_1.rules.minLength(8)
            ])
        });
        this.messages = {
            'email.required': 'Поле email является обязательным для заполнения',
            'email.email': 'Поле email должно быть действительным email адресом',
            'email.exists': 'Не существует аккаунта с введенным email',
            'password.required': 'Поле пароль является обязательным для заполнения',
            'email.minLength': 'Поле пароль должно содержать не менее 8 символов',
        };
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map