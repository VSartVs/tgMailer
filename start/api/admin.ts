import Route from '@ioc:Adonis/Core/Route'
export default function adminRoutes() {
  Route.group(() => {

  }).prefix('admin/')
    .middleware('auth')
}
