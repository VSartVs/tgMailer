import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Bot from 'App/Models/Bot'
import MailingStatuses from 'App/Enums/MailingStatuses'

export default class BotsController {

    public async get({request, response}: HttpContextContract) {

        const queryBots =  Bot
            .query()
            .withScopes((scopes) => {
                scopes.countMailings(MailingStatuses.PENDING, 'countQueueMailings')
                scopes.countMailings(MailingStatuses.ACTIVE, 'countActiveMailings')
            })

        if (request.requestData.name)
            queryBots.where('name', 'LIKE', '%' + request.requestData.name + '%')

        const bots = await queryBots
            .orderBy(request.requestData.sortProperty, request.requestData.sortFlag)
            .paginate(request.requestData.page, request.requestData.perPageCount)

        return response.json(bots)

    }

}
