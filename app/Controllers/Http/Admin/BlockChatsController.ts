import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BlockChat from 'App/Models/BlockChat'

export default class BlockChatsController {
    public async get({request, response}: HttpContextContract) {

        const queryBlockChats = BlockChat.query()
            .innerJoin('bots', join => {
                join.on('block_chats.bot_id', '=', 'bots.id')
            })
            .select('block_chats.id', 'block_chats.chat_id', 'block_chats.status','block_chats.bot_id', 'block_chats.created_at', 'bots.name as botName')
            .preload('bot')

        if (request.requestData.chatId)
            queryBlockChats.where('chatId', '=', request.requestData.chatId)

        if (request.requestData.botName)
            queryBlockChats.whereHas('bot', (query) => {
                query.where('name', 'LIKE', '%' + request.requestData.botName + '%')
            })

        if (request.requestData.status)
            queryBlockChats.where('status', '=', request.requestData.status)

        const blockChats = await queryBlockChats
            .orderBy(request.requestData.sortProperty, request.requestData.sortFlag)
            .paginate(request.requestData.page, request.requestData.perPageCount)

        return response.json(blockChats)

    }

    public async multipleDestroy({request, response}: HttpContextContract) {

        await BlockChat.query()
            .where('createdAt', '<=', request.requestData.dateToDelete)
            .delete()

        return response.status(200)

    }


    public async destroy({params, response}: HttpContextContract) {

        await BlockChat.query().where('id', params.id).delete()

        return response.status(200)

    }
}
