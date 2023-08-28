const {parentPort} = require('worker_threads')
const moment = require('moment')
const {createConnection, executeQuery} = require('./dbHelpers')

const getNewMailings = "SELECT `id`, `bot_id` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` <= ? AND `bot_id` NOT IN (\"+ connection.escape(?)+\") LIMIT 10"
const getNewMailingsWithoutBots = "SELECT `id`, `bot_id` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` <= ? LIMIT 10"
const getNextDate = "SELECT MIN(`required_start_at`) as `next_start_at` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` > ?"
let timer: NodeJS.Timeout | null = null
let nextMailing: string | null = null

async function getMailings(activeBotsIds: Array<number>) {
    const connection = createConnection()
    let params = [1, moment().format('YYYY-MM-DDTHH:mm:ss')]
    let query = getNewMailingsWithoutBots
    if (activeBotsIds.length > 0) {
        params.push(activeBotsIds)
        query = getNewMailings
    }

    console.log('workerDB search new mailings')
    let mailings = await executeQuery(connection, query, params)

    connection.end()
    return mailings
}

async function setTimer(date: string | null, forceUpdate: boolean) {
    if (date === null) {
        const connection = createConnection()
        let tmp = nextMailing === null ? moment().format('YYYY-MM-DDTHH:mm:ss') : moment(nextMailing).format('YYYY-MM-DDTHH:mm:ss')
        console.log('TMP '+ tmp)
        let nextMailingDate = await executeQuery(connection, getNextDate, [1, tmp])
        date = nextMailingDate[0].next_start_at !== null ? moment(nextMailingDate[0].next_start_at).format('YYYY-MM-DDTHH:mm:ss') : null
        console.log("date "+date)
        connection.end()
    }

    //console.log('setTimer: nextMailing - ' + nextMailing + ' | New Date - ' + date)


    if (date !== null && (moment(moment(date).format('YYYY-MM-DDTHH:mm:ss')).isAfter(nextMailing) || forceUpdate)) {
        console.log('---Update Timer---')

        let delay: number = moment(date).valueOf() - moment().valueOf()

        nextMailing = moment(date).format('YYYY-MM-DDTHH:mm:ss')

        if (timer !== null)
            clearTimeout(timer)

        timer = setTimeout(async () => {
            console.log('Привет, это таймер '+timer + ' date = '+moment().format('YYYY-MM-DDTHH:mm:ss'))

            let mailings = await getMailings([])
            console.log(mailings)
            if (mailings.length > 0)
                parentPort.postMessage(mailings)
            timer = null
            await setTimer(null, false)
        }, delay)
    }
    else
        nextMailing = null
}

parentPort.on('message', async (data: { activeBotsIds: Array<number>, date: string | null }) => {
    if (data.date === null) {
        let mailings = await getMailings(data.activeBotsIds)

        if (mailings.length > 0) {
            parentPort.postMessage(mailings)
        } else {
            if (timer === null)
                await setTimer(null, false)
        }
    } else {
        if (moment(moment(data.date).format('YYYY-MM-DDTHH:mm:ss')).isBefore(nextMailing) || nextMailing === null)
            await setTimer(data.date, true)
    }
})
