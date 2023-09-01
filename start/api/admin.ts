import Route from '@ioc:Adonis/Core/Route'

export default function adminRoutes() {
    Route.group(() => {

        Route.get('/', 'Admin/DashboardController.get').as('statistics.get')

        Route.group(() => {

            Route.get('/', 'Admin/BotsController.get').as('bots.get')
            Route.get('/:id', 'Admin/MailingsController.get').as('bots.mailings.get')

            Route.group(() => {

                Route.put('/:id','Admin/MailingsController.update').as('bots.mailings.update')
                Route.put('/restart/:id','Admin/MailingsController.restart').as('bots.mailings.restart')
                Route.delete('/:id','Admin/MailingsController.destroy').as('bots.mailings.destroy')

            }).prefix('mailings')

        }).prefix('bots')

        Route.get('/logs', 'Admin/LogsController.get').as('logs.get')

    }).prefix('admin/')
        .middleware('auth:jwt')
}
