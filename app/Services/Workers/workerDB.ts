const {parentPort} = require('worker_threads')
const moment = require('moment')

const {createConnection, executeQuery} = require('./dbHelpers')


const getNewMailings = "SELECT `id`, `bot_id` FROM `mailings` WHERE `status_id` = ? AND `required_start_at` < ? AND `bot_id` NOT IN (\"+ connection.escape(?)+\") LIMIT 10"
const getNewMailingsWithoutBots = "SELECT `id`, `bot_id` FROM `mailings` WHERE `status_id` = ? LIMIT 10"

parentPort.on('message', async (activeBotsIds: Array<number>) => {
    console.log('workerDB started')
    const connection = createConnection()
    let params = [1, moment().format()]
    let query = getNewMailingsWithoutBots
    if(activeBotsIds.length > 0) {
        params.push(activeBotsIds)
        query = getNewMailings
    }

    console.log('workerDB search new mailings')
    let mailings = await executeQuery(connection, query, params)

    if (mailings !== undefined)
        parentPort.postMessage(mailings)

});
