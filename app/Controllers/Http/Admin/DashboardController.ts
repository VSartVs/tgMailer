import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from 'moment'
import Bot from 'App/Models/Bot'
import Database from '@ioc:Adonis/Lucid/Database'
import MailingStatuses from 'App/Enums/MailingStatuses'
import Mailing from 'App/Models/Mailing'

export default class DashboardController {

    public async get({response}: HttpContextContract)
    {
        let queryBots = await this.makeQuery()
        let queryMailings = await this.makeQuery('required_start_at')
        let queryCompletedMailings = await this.makeQuery('end_at', MailingStatuses.COMPLETED)
        let queryFailedMailings = await this.makeQuery('end_at', MailingStatuses.FAILED)

        const bots = await Bot.query().select(Database.raw(queryBots))
        const mailings = await Mailing.query().select(Database.raw(queryMailings))
        const completedMailings = await Mailing.query().select(Database.raw(queryCompletedMailings))
        const failedMailings = await Mailing.query().select(Database.raw(queryFailedMailings))


        const botStatistics = await this.generateStatistics(bots)
        const mailingsStatistics = await this.generateStatistics(mailings)
        const completedMailingsStatistics = await this.generateStatistics(completedMailings)
        const failedMailingsStatistics = await this.generateStatistics(failedMailings)

        const botsCount = await Bot.query().count('* as total').first()
        const mailingsCount = await Mailing.query().count('* as total').first()
        const completedMailingsCount = await Mailing.query().where('statusId', '=', MailingStatuses.COMPLETED).count('* as total').first()
        const failedMailingsCount = await Mailing.query().where('statusId', '=', MailingStatuses.FAILED).count('* as total').first()



        return response.json({
            botStatistics: botStatistics,
            mailingsStatistics: mailingsStatistics,
            completedMailingsStatistics: completedMailingsStatistics,
            failedMailingsStatistics: failedMailingsStatistics,
            botsCounter: botsCount.$extras.total,
            mailingsCounter: mailingsCount.$extras.total,
            completedMailingsCounter: completedMailingsCount.$extras.total,
            failedMailingsCounter: failedMailingsCount.$extras.total
        })

    }

    private async makeQuery(field ='created_at',statusId :number|null = null) {
        let dates : Array<Array<string>> = []
        let startDate = moment().subtract(5, 'M').startOf('month')
        let months :Array<string> = []

        let counter = 1;

        while (counter <= 6){
            dates.push([startDate.format('YYYY-MM-DDTHH:mm:ss'), startDate.endOf('month').format('YYYY-MM-DDTHH:mm:ss')])
            months.push(startDate.format('MMMM'))
            startDate = startDate.add(1, 'M').startOf('month')
            counter++
        }

        let query = ''
        let partQuery = ''
        if(statusId !== null)
            partQuery = ` AND status_id = ${statusId}`
        for(let i = 0;  i < dates.length; i++){
            if(query.length === 0)
                query += `(SELECT COUNT(*) WHERE ${field} BETWEEN "${dates[i][0]}" AND "${dates[i][1]}" ${partQuery}) as ${ months[i]}`
            else
                query += `,(SELECT COUNT(*) WHERE ${field} BETWEEN "${dates[i][0]}" AND "${dates[i][1]}" ${partQuery}) as ${ months[i]}`
        }

        return query
    }

    private async generateStatistics(data: Array<any>, )
    {
        const statistics = new Map()
        await data.forEach(async(item) => {
            let keys = Object.keys(item.$extras)
            await keys.forEach(key => {
                if(statistics.has(key))
                    statistics.set(key, statistics.get(key) +item.$extras[key])
                else
                    statistics.set(key,item.$extras[key])
            })
        })
        return Object.fromEntries(statistics)

    }

}
