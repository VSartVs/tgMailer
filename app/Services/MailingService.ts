import {MailingServiceContract} from '@ioc:App/Services/MailingService'
import Chat from 'App/Models/Chat'
import Mailing from 'App/Models/Mailing'
import Bot from 'App/Models/Bot'
import WorkerPool from 'App/Services/Workers/workerPool'


export class MailingService implements MailingServiceContract {

  data: object

  constructor() {}

  public async saveData(data: object) {
    this.data = data
    const botId = await this.saveBot()
    const mailingId = await this.saveMailing(botId)
    await this.saveChats(mailingId)
    return WorkerPool.run({botId: botId, mailingId: mailingId})
  }

  private async saveBot() {
    const bot = await Bot.firstOrCreate(
      {name: this.data.botName},
      {name: this.data.botName, token: this.data.token}
    )
    return bot.id
  }

  private async saveMailing(botId: number) {
    const mailing = await Mailing.create(
      {
        message: this.data.message,
        requiredStartAt: this.data.startAt,
        photos: this.data.photos,
        inlineKeyboard: this.data.inlineKeyboard,
        replyKeyboard: this.data.replyKeyboard,
        botId: botId
      }
    )
    return mailing.id
  }

  private async saveChats(mailingId: number) {
    for (let i = 0; i < this.data.ids.length; i++) {
      await Chat.firstOrCreate(
        {mailingId: mailingId, chatId: this.data.ids[i]},
        {mailingId: mailingId, chatId: this.data.ids[i]}
      )
    }
  }



}
