import Route from '@ioc:Adonis/Core/Route'

export default function adminRoutes() {
    Route.group(() => {

        Route.get('/', 'Admin/DashboardController.get').as('statistics.get')

        Route.group(() => {

            Route.get('/', 'Admin/BotsController.get').as('bots.get')
            Route.get('/:id', 'Admin/MailingsController.get').as('bots.mailings.get')

            Route.group(() => {

                Route.get('/:id','Admin/MailingsController.show').as('bots.mailings.show')
                Route.put('/:id','Admin/MailingsController.update').as('bots.mailings.update')
                Route.put('/restart/:id','Admin/MailingsController.restart').as('bots.mailings.restart')
                Route.delete('/:id','Admin/MailingsController.destroy').as('bots.mailings.destroy')
                Route.post('/multiple/destroy','Admin/MailingsController.multipleDestroy').as('bots.mailings.multipleDestroy')

            }).prefix('mailings')

        }).prefix('bots')

        Route.group(() => {

            Route.get('/', 'Admin/LogsController.get').as('logs.get')

        }).prefix('logs')


    }).prefix('admin/')
        .middleware('auth:jwt')
}
