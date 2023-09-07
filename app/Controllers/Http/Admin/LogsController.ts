import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Log from 'App/Models/Log'

export default class LogsController {

  public async get({request, response}: HttpContextContract) {

    const queryLogs = Log.query()

    if (request.requestData.mailingId)
      queryLogs.where('message', 'LIKE', '%"mailingId":' + request.requestData.mailingId + '%')

    if (request.requestData.createdAt)
      queryLogs.whereBetween('createdAt', request.requestData.createdAt)

    if (request.requestData.type)
      queryLogs.where('type', '=', request.requestData.type)

    const logs = await queryLogs
      .orderBy(request.requestData.sortProperty, request.requestData.sortFlag)
      .paginate(request.requestData.page, request.requestData.perPageCount)

    return response.json(logs)

  }

  public async multipleDestroy({request, response}: HttpContextContract) {

    await Log.query()
      .where('createdAt', '<=', request.requestData.dateToDelete)
      .delete()

    return response.status(200)

  }


  public async destroy({params, response}: HttpContextContract) {

    await Log.query().where('id', params.id).delete()

    return response.status(200)

  }


}
