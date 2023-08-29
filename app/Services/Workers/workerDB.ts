import DBHelper from './dbHelper'
import MailingStatuses from '../../Enums/MailingStatuses'
import LogTypes from '../../Enums/LogTypes'
const {parentPort} = require('worker_threads')
const moment = require('moment')

const getNewMailings = "SELECT `id` as `mailingId`, `bot_id` as `botId` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` <= ? AND `bot_id` NOT IN (\"+ connection.escape(?)+\") LIMIT 10"
const getNewMailingsWithoutBots = "SELECT `id` as `mailingId`, `bot_id` as `botId` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` <= ? LIMIT 10"
const getNextDate = "SELECT MIN(`required_start_at`) as `next_start_at` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` > ?"
let timer: NodeJS.Timeout | null = null
let previousMailingDate: string | null = null

async function getMailings(activeBotsIds: Array<number>)
{
    let params = [MailingStatuses.PENDING, moment().format('YYYY-MM-DDTHH:mm:ss')]
    let query = getNewMailingsWithoutBots
    if (activeBotsIds.length > 0) {
        params.push(activeBotsIds)
        query = getNewMailings
    }

    return await DBHelper.executeQuery(query, params)
}

async function setTimer(date: string | null, forceUpdate: boolean)
{
    if (date === null) {
        let tmp = previousMailingDate === null ? moment().format('YYYY-MM-DDTHH:mm:ss') : moment(previousMailingDate).format('YYYY-MM-DDTHH:mm:ss')
        let previousMailingDateDate = await DBHelper.executeQuery(getNextDate, [MailingStatuses.PENDING, tmp])
        date = previousMailingDateDate[0].next_start_at !== null ? moment(previousMailingDateDate[0].next_start_at).format('YYYY-MM-DDTHH:mm:ss') : null
    }

    if (date !== null && (moment(moment(date).format('YYYY-MM-DDTHH:mm:ss')).isAfter(previousMailingDate) || forceUpdate)) {

        let delay: number = moment(date).valueOf() - moment().valueOf()
        if (timer !== null)
            clearTimeout(timer)

        timer = setTimeout(async () => {
            let mailings = await getMailings([])
            if (mailings.length > 0) {
                await DBHelper.addLog('Отработал таймер  №' + timer + ' на время ' + moment().format('YYYY-MM-DDTHH:mm:ss') + '. Рассылки ' + JSON.stringify(mailings), LogTypes.INFO)
                parentPort.postMessage(mailings)
            }
            else
                await DBHelper.addLog('Отработал таймер  №' + timer + ' на время ' + moment().format('YYYY-MM-DDTHH:mm:ss') + '. Рассылок по времени не найдено', LogTypes.WARNING)
            timer = null
            await setTimer(null, false)
        }, delay)

        await DBHelper.addLog('Поставлен таймер №' + timer + ' на время ' + date + '. Предыдущее время таймера ' + previousMailingDate, LogTypes.INFO)
        previousMailingDate = moment(date).format('YYYY-MM-DDTHH:mm:ss')
    }
    else {
        previousMailingDate = null
        await DBHelper.closeConnection()
    }
}

parentPort.on('message', async (data: { activeBotsIds: Array<number>, date: string | null }) => {
    if (data.date === null) {
        let mailings = await getMailings(data.activeBotsIds)

        if (mailings.length > 0) {
            parentPort.postMessage(mailings)
            await DBHelper.closeConnection()
        } else {
            if (timer === null)
                await setTimer(null, false)
        }
    }
    else {
        if (moment(moment(data.date).format('YYYY-MM-DDTHH:mm:ss')).isBefore(previousMailingDate) || previousMailingDate === null)
            await setTimer(data.date, true)
    }
})
