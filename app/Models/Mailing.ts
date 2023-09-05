import {DateTime} from 'luxon'
import {
    beforeSave,
    column,
    BelongsTo,
    belongsTo,
    hasMany,
    HasMany,
    BaseModel,
    scope,
    beforeDelete,
    afterFetch,
    afterFind,
    beforeCreate
} from '@ioc:Adonis/Lucid/Orm'
import Bot from 'App/Models/Bot'
import MailingStatus from 'App/Models/MailingStatus'
import Chat from 'App/Models/Chat'
import Drive from '@ioc:Adonis/Core/Drive'


export default class Mailing extends BaseModel {

    public serializeExtras() {
        return {
            countChats: this.$extras.countChats,
            countCompletedChats: this.$extras.countCompletedChats,
        }
    }

    public static countChats = scope((query, action: string | null, fieldName: string) => {
        if (action !== null) {
            query.withCount('chats', (query) => {
                query.where('sentAt', action, null).as(fieldName)
            })
        } else {
            query.withCount('chats', (query) => {
                query.as(fieldName)
            })
        }
    })

    @column({isPrimary: true})
    public id: number

    @column()
    public message: String

    @column.dateTime({
        serialize: (value) => value.toFormat('dd.LL.yyyy HH:mm')
    })
    public requiredStartAt: DateTime

    @column.dateTime({
        serialize: (value) => value === null ? value : value.toFormat('dd.LL.yyyy HH:mm')
    })
    public actualStartAt: DateTime | null

    @column.dateTime({
        serialize: (value) => value === null ? value : value.toFormat('dd.LL.yyyy HH:mm')
    })
    public endAt: DateTime | null

    @column()
    public photos: string

    @column()
    public inlineKeyboard: string | null

    @column()
    public replyKeyboard: string | null

    @column({serializeAs: null})
    public botId: number

    @column()
    public statusId: number

    @column.dateTime({autoCreate: true, serializeAs: null})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null})
    public updatedAt: DateTime


    @beforeSave()
    @beforeCreate()
    public static async saveJsonFields(mailing: Mailing) {
        mailing.photos = JSON.stringify(mailing.photos)
        if (mailing.inlineKeyboard !== null)
            mailing.inlineKeyboard = JSON.stringify(mailing.inlineKeyboard)
        if (mailing.replyKeyboard !== null)
            mailing.replyKeyboard = JSON.stringify(mailing.replyKeyboard)
    }

    @afterFetch()
    @afterFind()
    public static async readJsonFields(mailing: Mailing) {
        if (typeof mailing.photos === "string")
            mailing.photos = JSON.parse(mailing.photos)
        if (mailing.inlineKeyboard !== null && typeof mailing.inlineKeyboard === "string")
            mailing.inlineKeyboard = JSON.parse(mailing.inlineKeyboard)

        if (mailing.replyKeyboard !== null && typeof mailing.replyKeyboard === "string")
            mailing.replyKeyboard = JSON.parse(mailing.replyKeyboard)

    }

    @beforeDelete()
    public static async deleteMailingFiles(mailing: Mailing) {
        let photos = JSON.parse(mailing.photos)
        await photos.forEach(async (photo) => {
            console.log(photo)
            if (await Drive.exists(photo.slice(photo.lastIndexOf('mailings') - 1, photo.length))) {
                await Drive.delete(photo.slice(photo.lastIndexOf('mailings') - 1, photo.length))
            }
        })
    }

    @belongsTo(() => Bot)
    public bot: BelongsTo<typeof Bot>

    @belongsTo(() => MailingStatus, {
        foreignKey: 'statusId',
    })
    public status: BelongsTo<typeof MailingStatus>

    @hasMany(() => Chat)
    public chats: HasMany<typeof Chat>
}
