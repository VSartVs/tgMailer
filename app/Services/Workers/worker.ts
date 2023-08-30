import process from "process";
const {isMainThread, parentPort} = require('worker_threads')
const moment = require('moment')
import DBHelper from './dbHelper'
import MailingStatuses from '../../Enums/MailingStatuses'
import LogTypes from '../../Enums/LogTypes'
const axios = require('axios')

if (isMainThread)
    throw new Error('Its not a worker')

const getMailingQuery = 'SELECT `mailings`.*, `bots`.`token` as `botToken` FROM `mailings` INNER JOIN `bots` ON (`mailings`.`bot_id`=`bots`.`id`) WHERE `status_id` = ? AND `mailings`.`id` = ? LIMIT 1'
const startMailingQuery = 'UPDATE `mailings` SET `status_id` = ?, `actual_start_at` = ?  WHERE `id` =  ?'
const endMailingQuery = 'UPDATE `mailings` SET `status_id` = ?, `end_at` = ?  WHERE `id` = ?'
const getChatQuery = 'SELECT * FROM `chats` WHERE `sent_at` IS NULL AND `mailing_id` = ? LIMIT 1'
const updateChatQuery = 'UPDATE `chats` SET `sent_at`= ? WHERE `id`=?'

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop()
{
    await delay(2000)
}

parentPort.on('message', async (data: { botId: number, mailingId: number }) => {

    await DBHelper.executeQuery(startMailingQuery, [MailingStatuses.ACTIVE, moment().format(), data.mailingId])

    let mailing = await DBHelper.executeQuery(getMailingQuery, [MailingStatuses.ACTIVE, data.mailingId])
    let chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])

    while (chat[0] !== undefined && mailing[0] !== undefined) {
        await loop().then(async () => {

            const time = process.env.DISABLE_NOTIFICATION_TIME
            let disableNotification = moment(moment().format('YYYY-MM-DD HH:mm')).isAfter(moment().format('YYYY-MM-DD') + ' ' + time)

            let tgAPIMethod = 'sendPhoto'
            let data = {
                chat_id: chat[0].chat_id,
                disable_notification: disableNotification,
            }
            if (mailing[0].photos.length > 1) {
                tgAPIMethod = 'sendMediaGroup'
                let tmpImagesArr = []
                for (let i = 0; i < mailing[0].photos.length; i++) {
                    let imageItem = {
                        type: 'photo',
                        media: mailing[0].photos[i]
                    }
                    if (i === 0)
                        imageItem.caption = mailing[0].message

                    tmpImagesArr.push(imageItem)
                }
                data.media = tmpImagesArr
            } else {
                data.caption = mailing[0].message
                data.photo = mailing[0].photos[0]
                let replyMarkup = {}
                if (mailing[0].inline_keyboard !== null)
                    replyMarkup.inline_keyboard = mailing[0].inline_keyboard
                if (mailing[0].reply_keyboard !== null)
                    replyMarkup.keyboard = mailing[0].reply_keyboard
                data.reply_markup = replyMarkup
            }

           await axios.post(`https://api.telegram.org/bot${mailing[0].botToken}/${tgAPIMethod}`, data)
                .then(async (result) => {
                   await DBHelper.executeQuery(updateChatQuery, [moment().format(), chat[0].id])
                })
                .catch(async (error) => {
                    await DBHelper.addLog('Telegram API response ' + JSON.stringify(error.response.data), LogTypes.ERROR, true)
                })

        })

        let previousMailingVersion = chat[0].mailing_version
        chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])

        if (chat[0] !== undefined && chat[0].mailing_version !== previousMailingVersion) {
            mailing = await DBHelper.executeQuery(getMailingQuery, [MailingStatuses.ACTIVE, data.mailingId])
            if (mailing.length > 0)
                await DBHelper.addLog('Во время выполнения была изменена "mailingId":' + data.mailingId, LogTypes.WARNING)
            else
                await DBHelper.addLog('Во время выполнения была отменена "mailingId":' + data.mailingId, LogTypes.WARNING)
        }
    }

    await DBHelper.executeQuery(endMailingQuery, [MailingStatuses.COMPLETED, moment().format(), data.mailingId])
    parentPort.postMessage({botId: data.botId, message: 'Завершена "mailingId":' + data.mailingId})
    await DBHelper.closeConnection()
})
