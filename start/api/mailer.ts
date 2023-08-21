import Route from '@ioc:Adonis/Core/Route'
export default function mailingRoutes() {
  Route.group(() => {
    Route.post('/create', 'Mailer/MailersController.create').as('mailing.create')
  }).prefix('mailing')
}
