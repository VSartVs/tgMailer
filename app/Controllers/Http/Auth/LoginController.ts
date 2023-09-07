import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'


export default class LoginController
{
  public async login({request, response, auth}: HttpContextContract) {

    const data = await request.validate(LoginValidator)

    try {
      const token = await auth.use('jwt').attempt(data.email, data.password)
      return response.json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      })
    }catch (e){
      return response.status(422).json({
        errors: {
          password: ['Неверный пароль']
        }
      })
    }

  }

  public async refresh ({auth, request, response}: HttpContextContract) {
    const refreshToken = request.input('refresh_token')
    const token = await auth.use('jwt').loginViaRefreshToken(refreshToken)
    return response.json({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    })
  }

  public async logout({auth, response}: HttpContextContract) {
    await auth.use('jwt').revoke()
    return response.status(200)
  }

}
