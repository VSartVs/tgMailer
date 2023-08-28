const {isMainThread, parentPort} = require('worker_threads')
const moment = require('moment')
import DBHelper from './dbHelper'


if (isMainThread) {
  throw new Error('Its not a worker')
}

const getMailingQuery = "SELECT * FROM `mailings` WHERE `status_id` = ?, `id` = ? LIMIT 1"
const startMailingQuery = "UPDATE `mailings` SET `status_id` = ?, `actual_start_at` = ?  WHERE `id` =  ?"
const endMailingQuery = "UPDATE `mailings` SET `status_id` = ?, `end_at` = ?  WHERE `id` = ?"
const getChatQuery = "SELECT * FROM `chats` WHERE `sent_at` IS NULL AND `mailing_id` = ? LIMIT 1"
const updateChatQuery = "UPDATE `chats` SET `sent_at`= ? WHERE `id`=?"

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop() {
  await delay(6000)
}

parentPort.on('message', async (data: {botId: number, mailingId: number}) => {
  console.log('START mailing # ' + data.mailingId)

  let tmp = await DBHelper.executeQuery(startMailingQuery, [2, moment().format(), data.mailingId])

  //let mailing = await DBHelper.executeQuery(getMailingQuery, [1, data.mailingId])

  let chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])


  while (chat[0] !== undefined) {
    await loop().then(async () => {

      await DBHelper.executeQuery(updateChatQuery, [moment().format(), chat[0].id])

    })

    chat = await DBHelper.executeQuery(getChatQuery, [data.mailingId])
  }

  await DBHelper.executeQuery(endMailingQuery, [3, moment().format(), data.mailingId])


  parentPort.postMessage({botId: data.botId})
  await DBHelper.closeConnection()
  console.log('END of mailing # ' + data.mailingId)

})
