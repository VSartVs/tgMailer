import Route from '@ioc:Adonis/Core/Route'

export default function adminRoutes() {
  Route.group(() => {

    Route.get('/statistics', 'Admin/DashboardController.get').as('statistics.get')

    Route.group(() => {

      Route.get('/', 'Admin/BotsController.get').as('bots.get')
      Route.get('/:id', 'Admin/MailingsController.get').as('bots.mailings.get')

      Route.group(() => {

        Route.get('/:id', 'Admin/MailingsController.show').as('bots.mailings.show')
        Route.put('/:id', 'Admin/MailingsController.update').as('bots.mailings.update')
        Route.put('/restart/:id', 'Admin/MailingsController.restart').as('bots.mailings.restart')
        Route.delete('/:id', 'Admin/MailingsController.destroy').as('bots.mailings.destroy')
        Route.post('/multiple/destroy', 'Admin/MailingsController.multipleDestroy').as('bots.mailings.multipleDestroy')

      }).prefix('mailings')

    }).prefix('bots')

    Route.group(() => {

      Route.get('/', 'Admin/LogsController.get').as('logs.get')
      Route.delete('/:id', 'Admin/LogsController.destroy').as('logs.destroy')
      Route.post('/multiple/destroy', 'Admin/LogsController.multipleDestroy').as('logs.multipleDestroy')

    }).prefix('logs')

    Route.group(() => {

      Route.get('/', 'Admin/SettingsController.get').as('settings.get')
      Route.put('/', 'Admin/SettingsController.update').as('settings.update')

    }).prefix('settings')

    Route.group(() => {

      Route.get('/', 'Admin/BlockChatsController.get').as('block.chats.get')
      Route.delete('/:id', 'Admin/BlockChatsController.destroy').as('block.chat.destroy')
      Route.post('/multiple/destroy', 'Admin/BlockChatsController.multipleDestroy').as('block.chats.multipleDestroy')

    }).prefix('block/chats')


  }).prefix('admin/')
    .middleware('auth:jwt')
}
