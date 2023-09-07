import {schema, CustomMessages} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {CustomReporter} from 'App/Validators/Reporters/CustomReporter'
import {rules} from '@adonisjs/validator/build/src/Rules'

export default class UpdateSettingValidator {

    constructor(protected ctx: HttpContextContract) {
    }

    public reporter = CustomReporter
    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */

    public schema = schema.create({
        email: schema.string({}, [
            rules.required(),
            rules.email(),
            rules.unique({
                table: 'users',
                column: 'email',
                whereNot: {
                    id: this.ctx.auth.user.id,
                },
            }),
        ]),
        password: schema.string.nullableAndOptional({}, [
            rules.minLength(8)
        ])
    })

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages: CustomMessages = {
        'email.required': 'Поле email является обязательным для заполнения',
        'email.email': 'Поле email должно быть действительным email адресом',
        'email.unique': 'Аккаунт с введенным email уже существует',
        'password.minLength': 'Поле пароль должно содержать не менее 8 символов',
    }
}
