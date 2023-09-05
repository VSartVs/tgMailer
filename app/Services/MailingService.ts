import {MailingServiceContract} from '@ioc:App/Services/MailingService'
import Chat from 'App/Models/Chat'
import Mailing from 'App/Models/Mailing'
import Bot from 'App/Models/Bot'
import WorkerPool from 'App/Services/Workers/workerPool'
import moment  from 'moment'
import {DateTime} from 'luxon'
import MailingStatuses from 'App/Enums/MailingStatuses'

export class MailingService implements MailingServiceContract {

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

    constructor() {}

    public async saveData(data: {
        botName: string,
        token: string,
        message: string,
        startAt: DateTime,
        photos: Array<string>,
        inlineKeyboard: Array<any>,
        replyKeyboard: Array<any>,
        ids: Array<string>
    }) {
        this.data = data
        const botId = await this.saveBot()
        const mailing = await this.saveMailing(botId)
        await this.saveChats(mailing.id)

        const requiredStartAt = moment(mailing.requiredStartAt.toISO({ includeOffset: false, suppressMilliseconds: true })).format('YYYY-MM-DDTHH:mm:ss')
        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss')
        if (moment(requiredStartAt).isSameOrBefore(currentDate)){
            return WorkerPool.run({botId: botId, mailingId: mailing.id})
        }

        WorkerPool.updateDBWorkerTimer(requiredStartAt)
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

    public async updateMailing(mailing: Mailing, newStatus: number, newDate: DateTime | string) : Promise<string> {
        let currentDate = moment().format('YYYY-MM-DDTHH:mm:ss')
        let nextDate = newDate
        if(typeof newDate === DateTime)
            nextDate = moment(newDate.toISO({ includeOffset: false, suppressMilliseconds: true })).format('YYYY-MM-DDTHH:mm:ss')

        console.log(nextDate)

        let result : string = 'Рассылка была успешно изменена'
        let startTimer = false
        if(mailing.statusId !== newStatus && newStatus !== MailingStatuses.ACTIVE) {
            mailing.statusId = newStatus
            if (newStatus !== MailingStatuses.PENDING) {
                mailing.endAt = DateTime.local()
                result = 'Рассылка была отменена'
            }else{
                mailing.actualStartAt = null
                mailing.endAt = null
                mailing.requiredStartAt = newDate
                await this.updateChats(mailing.id, true)
                result = 'Рассылка была перезапущена и поставлена в очередь'
                startTimer = true
            }
        }else{
            if(mailing.statusId === MailingStatuses.ACTIVE) {
                await this.updateChats(mailing.id, false)
                result = 'Активная рассылка была изменена, неотправленный сообщения будут использовать новые данные'
                startTimer = true
            }else{
                mailing.requiredStartAt = newDate
            }
        }
        mailing.save()
        if(startTimer){
            if (moment(moment(nextDate)).isSameOrBefore(currentDate)){
                WorkerPool.run({botId: mailing.botId, mailingId: mailing.id})
            }else{
                WorkerPool.updateDBWorkerTimer(nextDate)
            }
        }

        return result

    }

    private async updateChats(mailingId: number, resetSentAt= false) {
        const lastProcessedChat = await Chat.query()
            .where('mailingId', '=', mailingId)
            .where('sentAt', 'IS NOT', null)
            .orderBy('id', 'desc')
            .first()
        let mailingVersion = lastProcessedChat === null ? 1 : lastProcessedChat.mailingVersion+1
        if(resetSentAt)
            await Chat.query().where({mailingId: mailingId}).update({mailingVersion: mailingVersion, sentAt: null})
        else
            await Chat.query().where({mailingId: mailingId, sentAt: null}).update({mailingVersion: mailingVersion})

    }


}
