const {isMainThread, parentPort} = require('worker_threads')
const moment = require('moment')
import DBHelper from './dbHelper'
import MailingStatuses from '../../Enums/MailingStatuses'
import LogTypes from '../../Enums/LogTypes'

if (isMainThread)
    throw new Error('Its not a worker')

const getMailingQuery = 'SELECT * FROM `mailings` WHERE `status_id` = ? AND `id` = ? LIMIT 1'
const startMailingQuery = 'UPDATE `mailings` SET `status_id` = ?, `actual_start_at` = ?  WHERE `id` =  ?'
const endMailingQuery = 'UPDATE `mailings` SET `status_id` = ?, `end_at` = ?  WHERE `id` = ?'
const getChatQuery = 'SELECT * FROM `chats` WHERE `sent_at` IS NULL AND `mailing_id` = ? LIMIT 1'
const updateChatQuery = 'UPDATE `chats` SET `sent_at`= ? WHERE `id`=?'

function delay(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop()
{
    await delay(6000)
}


parentPort.on('message', async (data: { botId: number, mailingId: number }) => {

    await DBHelper.executeQuery(startMailingQuery, [MailingStatuses.ACTIVE, moment().format(), data.mailingId])

    let mailing = await DBHelper.executeQuery(getMailingQuery, [MailingStatuses.ACTIVE, data.mailingId])
    let chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])

    while (chat[0] !== undefined && mailing[0] !== undefined) {
        await loop().then(async () => {
            /*
            * TODO: REQUEST TO TELEGRAM API
            */
            await DBHelper.executeQuery(updateChatQuery, [moment().format(), chat[0].id])
        })

        let previousMailingVersion = chat[0].mailing_version
        chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])

        if (chat[0] !== undefined && chat[0].mailing_version !== previousMailingVersion) {
            mailing = await DBHelper.executeQuery(getMailingQuery, [MailingStatuses.ACTIVE, data.mailingId])
            if(mailing.length > 0)
                await DBHelper.addLog('Во время выполнения была изменена "mailingId":'+ data.mailingId, LogTypes.WARNING)
            else
                await DBHelper.addLog('Во время выполнения была отменена "mailingId":'+ data.mailingId, LogTypes.WARNING)
        }
    }

    await DBHelper.executeQuery(endMailingQuery, [MailingStatuses.COMPLETED, moment().format(), data.mailingId])
    parentPort.postMessage({botId: data.botId, message: 'Завершена "mailingId":'+data.mailingId})
    await DBHelper.closeConnection()
})
