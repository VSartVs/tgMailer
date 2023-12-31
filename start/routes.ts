/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import authRoutes from './api/auth'
import adminRoutes from './api/admin'
import mailingRoutes from './api/mailer'

Route.group(() => {
  authRoutes()
  adminRoutes()
  mailingRoutes()
}).prefix('api/v1/')

Route.get('*', async ({ view }) => {
  return view.render('app')
}).where('*', '')
