
declare module '@ioc:App/Services/MailingService' {
  import Mailing from 'App/Models/Mailing'
  import {DateTime} from 'luxon'

  export interface MailingServiceContract {
    data: {
      botName: string,
      token: string,
      message: string,
      startAt: DateTime,
      photos: Array<string>,
      inlineKeyboard: Array<any>,
      replyKeyboard: Array<any>,
      ids: Array<string>
    }
    saveData(data:{
      botName: string,
      token: string,
      message: string,
      startAt: DateTime,
      photos: Array<string>,
      inlineKeyboard: Array<any>,
      replyKeyboard: Array<any>,
      ids: Array<string>
    }): Promise<string>,
    updateMailing(mailing: Mailing, newStatus: number, newDate: DateTime) : Promise<string>

  }
}
