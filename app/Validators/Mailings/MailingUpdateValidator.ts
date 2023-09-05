import {schema, CustomMessages} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {CustomReporter} from 'App/Validators/Reporters/CustomReporter'
import {rules} from '@adonisjs/validator/build/src/Rules'

export default class MailingUpdateValidator {
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

        id: schema.number([
            rules.required(),
            rules.exists({ table: 'mailings', column: 'id' })
        ]),

        statusId: schema.number([
            rules.required(),
            rules.exists({ table: 'mailing_statuses', column: 'id' })
        ]),

        requiredStartAt: schema.date({format: 'dd.LL.yyyy HH:mm'}, [
            rules.required(),
        ]),

        message: schema.string({}, [
            rules.required(),
            rules.maxLength(1024)
        ]),

        photos: schema.array([
            rules.required(),
            rules.maxLength(10)
        ]).members(schema.string.nullableAndOptional()),

        photosFiles: schema.array.nullableAndOptional([
            rules.minLength(0),
            rules.maxLength(10)
        ]).members(schema.file.nullableAndOptional({
            size: '4mb',
            extnames: ['jpg', 'jpeg', 'png'],
        })),

        inlineKeyboard: schema.array.nullable().anyMembers(),

        replyKeyboard: schema.array.nullable().anyMembers(),

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
    public messages: CustomMessages =
        {
            'id.exists': 'Выбранной рассылки не существует',
            'statusId.required': 'Статус рассылки является обязательным полем',
            'statusId.exists': 'Выбранного статуса не существует',
            'startAt.required': 'Дата начала рассылки является обязательным полем',
            'startAt.after': 'Дата начала рассылки должна быть больше текущей',
            'message.required':'Сообщение рассылки является обязательным полем',
            'message.maxLength':'Максимальная длина поля {{options.maxLength}}',
            'photos.required': 'Изображения рассылки является обязательным полем',
            'photos.maxLength':'Максимальное количествло изображений {{options.maxLength}}',
            'photosFiles.maxLength':'Максимальное количествло изображений {{options.maxLength}}',
            'photosFiles.*.size': 'Размер файла должен быть меньше {{ options.size }}',
            'photosFiles.*.extname': 'Допустимые расширения для изображения {{ options.extnames }}',
        }
}
