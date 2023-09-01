import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mailing from 'App/Models/Mailing'
import Log from "App/Models/Log";

export default class MailingsController {

    public async get({request, params, response}: HttpContextContract)
    {

        const queryMailings =  Mailing
            .query()
            .where('botId', '=', params.id)
            .withScopes((scopes) => {
                scopes.countChats(null, 'countChats')
                scopes.countChats('IS NOT', 'countCompletedChats')
            })
            .preload('status')

        if (request.requestData.message)
            queryMailings.where('message', 'LIKE', '%' + request.requestData.message + '%')

        if (request.requestData.statusId)
            queryMailings.where('statusId', '=',  request.requestData.statusId)

        let searchParams = Object.keys(request.requestData)

        searchParams.forEach(param => {
            if (param.endsWith('At'))
                queryMailings.whereBetween(param, request.requestData[param])
        })

        const mailings = await queryMailings
            .orderBy(request.requestData.sortProperty, request.requestData.sortFlag)
            .paginate(request.requestData.page, request.requestData.perPageCount)

        return response.json(mailings)

    }

    public async update({request, params, response}: HttpContextContract)
    {


    }

    public async restart({request, params, response}: HttpContextContract)
    {


    }


    public async destroy({ params, response}: HttpContextContract)
    {
        await Mailing.query().where('id', params.id).delete()
       // await Log.query().where('message', 'LIKE', '%"mailingId":' + params.id + '%').delete()
        return response.status(200)

    }



}
