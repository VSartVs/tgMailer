import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import MailingValidator from 'App/Validators/Mailer/MailingValidator'
import Mailing from 'App/Models/Mailing'
import Bot from 'App/Models/Bot'
import Chat from 'App/Models/Chat'


export default class MailersController {

  public async create({request, response}: HttpContextContract) {

    const data = await request.validate(MailingValidator)

    const bot = await Bot.firstOrCreate(
      {name: data.botName},
      {name: data.botName, token: data.token}
    )

    const mailing = await Mailing.create(
      {
        message: data.message,
        requiredStartAt: data.startAt,
        photos: data.photos,
        inlineKeyboard: data.inlineKeyboard,
        replyKeyboard: data.replyKeyboard,
        botId: bot.id
      }
    )

    for (let i = 0; i < data.ids.length; i++) {
        await Chat.firstOrCreate(
          {mailingId: mailing.id, chatId: data.ids[i]},
          {mailingId: mailing.id, chatId: data.ids[i]}
        )
    }


    return response.status(200)
  }
}
