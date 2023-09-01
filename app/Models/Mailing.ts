import {DateTime} from 'luxon'
import {
  beforeSave,
  column,
  BelongsTo,
  afterFetch,
  afterFind,
  belongsTo,
  hasMany,
  HasMany,
  BaseModel,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import Bot from 'App/Models/Bot'
import MailingStatus from 'App/Models/MailingStatus'
import Chat from 'App/Models/Chat'


export default class Mailing extends BaseModel {

  public serializeExtras() {
    return {
      countChats: this.$extras.countChats,
      countCompletedChats: this.$extras.countCompletedChats,
    }
  }

  public static countChats = scope((query, action: string | null, fieldName: string) => {
   if(action !== null) {
     query.withCount('chats', (query) => {
       query.where('sentAt', action, null).as(fieldName)
     })
   }else{
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
    serialize: (value) => value.toFormat('dd.LL.yyyy HH:mm')
  })
  public actualStartAt: DateTime | null

  @column.dateTime({
    serialize: (value) => value.toFormat('dd.LL.yyyy HH:mm')
  })
  public endAt: DateTime | null

  @column()
  public photos: string

  @column()
  public inlineKeyboard: string | null

  @column()
  public replyKeyboard: string | null

  @column({serializeAs: null })
  public botId: number

  @column()
  public statusId: number

  @column.dateTime({autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime


  @beforeSave()
  public static async saveJsonFields(mailing: Mailing) {
    mailing.photos = JSON.stringify(mailing.photos)
    if (mailing.inlineKeyboard !== null)
      mailing.inlineKeyboard = JSON.stringify(mailing.inlineKeyboard)
    if (mailing.replyKeyboard !== null)
      mailing.replyKeyboard = JSON.stringify(mailing.replyKeyboard)
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
