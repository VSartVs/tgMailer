import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Mailing from 'App/Models/Mailing'
import MailingUpdateValidator from 'App/Validators/Mailings/MailingUpdateValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import Env from '@ioc:Adonis/Core/Env'
import {inject} from '@adonisjs/fold'
import {MailingService} from 'App/Services/MailingService'
import moment, {now} from 'moment/moment'
import MultipleDestroyMailingValidator from 'App/Validators/Mailings/MultipleDestroyMailingValidator'
import MailingStatuses from "App/Enums/MailingStatuses";

export default class MailingsController {

    public async get({request, params, response}: HttpContextContract) {

        const queryMailings = Mailing
            .query()
            .select('id', 'message', 'requiredStartAt', 'actualStartAt', 'endAt', 'statusId')
            .where('botId', '=', params.id)
            .withScopes((scopes) => {
                scopes.countChats(null, 'countChats')
                scopes.countChats('IS NOT', 'countCompletedChats')
            })
            .preload('status')

        if (request.requestData.message)
            queryMailings.where('message', 'LIKE', '%' + request.requestData.message + '%')

        if (request.requestData.statusId)
            queryMailings.where('statusId', '=', request.requestData.statusId)

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

    public async show({params, response}: HttpContextContract) {
        const mailing = await Mailing.query()
            .where('id', params.id)
            .preload('status')
            .firstOrFail()

        return response.json(mailing)

    }

    @inject(MailingService)
    public async update({request, response}: HttpContextContract, mailingService: MailingService) {

        const data = await request.validate(MailingUpdateValidator)

        const mailing = await Mailing.findOrFail(data.id)

        mailing.message = data.message
        mailing.inlineKeyboard = data.inlineKeyboard
        mailing.replyKeyboard = data.replyKeyboard

        let photosFiles: Array<string> = []


        const images = request.files('photosFiles')

        for (let image of images) {
            let path = 'mailings/' + mailing.id
            await image.moveToDisk(path).then(async () => {
                photosFiles.push(Env.get('BASE_URL') + await Drive.getUrl(path + '/' + image.fileName))
            })
        }

        mailing.photos.forEach(async (photo) => {
            if (!data.photos.includes(photo)) {
                if (await Drive.exists(photo.slice(photo.lastIndexOf('mailings') - 1, photo.length))) {
                    await Drive.delete(photo.slice(photo.lastIndexOf('mailings') - 1, photo.length))
                }
            }
        })

        mailing.photos = [...data.photos, ...photosFiles]

        mailing.save()

        let message = await mailingService.updateMailing(mailing, data.statusId, data.requiredStartAt)

        return response.json({message: message})

    }

    @inject(MailingService)
    public async restart({params, response}: HttpContextContract,  mailingService: MailingService) {

        const mailing = await Mailing.findOrFail(params.id)

        let message = await mailingService.updateMailing(mailing, MailingStatuses.PENDING, moment().format('YYYY-MM-DDTHH:mm:ss'))

        return response.json({message: message})
    }

    public async multipleDestroy({request, response}: HttpContextContract) {


        const data = await request.validate(MultipleDestroyMailingValidator)

        const mailings = await Mailing.query()
            .where('botId', '=', data.botId)
            .where('endAt', '<=', moment(data.dateToDelete.toISO({ includeOffset: false, suppressMilliseconds: true })).format('YYYY-MM-DDTHH:mm:ss'))

        mailings.forEach(mailing => {
            mailing.delete()
        })

        return response.status(200)

    }


    public async destroy({params, response}: HttpContextContract) {

        const mailing = await Mailing.query().where('id', params.id).first()

        mailing.delete()
        // await Log.query().where('message', 'LIKE', '%"mailingId":' + params.id + '%').delete()
        return response.status(200)

    }


}
