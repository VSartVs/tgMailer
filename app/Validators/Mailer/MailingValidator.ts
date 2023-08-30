import {schema, CustomMessages} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {CustomReporter} from 'App/Validators/Reporters/CustomReporter'
import {rules} from "@adonisjs/validator/build/src/Rules";

export default class MailingValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public reporter = CustomReporter

  /*
   * Define schema to validate the 'shape', 'type', 'formatting' and 'integrity' of data.
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
    botName: schema.string({}, [
      rules.required(),
      rules.maxLength(255)
    ]),

    token: schema.string({}, [
      rules.required(),
      rules.maxLength(255)
    ]),

    startAt: schema.date({  format: 'dd.LL.yyyy HH:mm:ss'}, [
      rules.required(),
    ]),

    ids: schema.array([
      rules.required(),
    ]).members(schema.string()),

    message: schema.string({}, [
      rules.required(),
      rules.maxLength(1024)
    ]),

    photos: schema.array([
      rules.required(),
    ]).members(schema.string()),

    // inlineKeyboard: schema.object.nullable().anyMembers(),
    inlineKeyboard: schema.array.nullable().anyMembers(),
    //replyKeyboard: schema.object.nullable().anyMembers(),
    replyKeyboard:  schema.array.nullable().anyMembers(),

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
  public messages: CustomMessages = {}
}
