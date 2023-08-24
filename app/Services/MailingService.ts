import {MailingServiceContract} from '@ioc:App/Services/MailingService'
import Chat from 'App/Models/Chat'
import Mailing from 'App/Models/Mailing'
import Bot from 'App/Models/Bot'
import WorkerPool from 'App/Services/Workers/workerPool'
import moment from "moment";
import * as console from "console";

export class MailingService implements MailingServiceContract {

    data: object

    constructor() {
    }

    public async saveData(data: object) {
        this.data = data
        const botId = await this.saveBot()
        const mailing = await this.saveMailing(botId)
        await this.saveChats(mailing.id)

        const requiredStartAtFormat = mailing.requiredStartAt.toISO({ includeOffset: false, suppressMilliseconds: true })
        const requiredStartAtMomentFormat = moment(requiredStartAtFormat).format('YYYY-MM-DDTHH:mm:ss')
        const momentFormat = moment().format('YYYY-MM-DDTHH:mm:ss')
        if (moment(moment(requiredStartAtMomentFormat)).isSameOrBefore(momentFormat)){
            return WorkerPool.run({botId: botId, mailingId: mailing.id})
        }
        return 'The mailing has been added to the queue'
    }

    private async saveBot() {
        const bot = await Bot.firstOrCreate(
            {name: this.data.botName},
            {name: this.data.botName, token: this.data.token}
        )
        return bot.id
    }

    private async saveMailing(botId: number) {
        return await Mailing.create(
            {
                message: this.data.message,
                requiredStartAt: this.data.startAt,
                photos: this.data.photos,
                inlineKeyboard: this.data.inlineKeyboard,
                replyKeyboard: this.data.replyKeyboard,
                botId: botId
            }
        )
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
