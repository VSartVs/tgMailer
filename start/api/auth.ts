import Route from '@ioc:Adonis/Core/Route'
export default function authRoutes() {
  Route.group(() => {
    Route.post('login', 'Auth/LoginController.login').as('login')
    Route.post('refresh/token', 'Auth/LoginController.refresh').as('refresh')
    Route.post('logout', 'Auth/LoginController.logout').as('logout').middleware('auth')
  })
}
