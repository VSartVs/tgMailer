import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {inject} from '@adonisjs/fold'
import MailingValidator from 'App/Validators/Mailer/MailingValidator'
import {MailingService} from "App/Services/MailingService"

export default class MailersController {

  @inject(MailingService)
  public async create({request, response}: HttpContextContract, mailingService: MailingService) {

    const data = await request.validate(MailingValidator)

    let res = await mailingService.saveData(data)

    return response.json(res)

  }
}
