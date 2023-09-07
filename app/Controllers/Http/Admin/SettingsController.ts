import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateSettingValidator from 'App/Validators/Auth/UpdateSettingValidator'
import User from 'App/Models/User'
export default class SettingsController {
    public async get({auth, response}: HttpContextContract) {

        const authEmail = auth.user.email

        return response.json({
            email: authEmail,
            password: null
        })

    }

    public async update({request, auth, response}: HttpContextContract) {

        const data = await request.validate(UpdateSettingValidator)

        const user = await User.query().where('id', '=', auth.user.id).first()

        user.email = data.email
        if(data.password !== null)
            user.password = data.password
        user.save()

        return response.status(200)

    }
}
