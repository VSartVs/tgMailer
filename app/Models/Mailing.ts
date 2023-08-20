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
  BaseModel
} from '@ioc:Adonis/Lucid/Orm'
import Bot from 'App/Models/Bot'
import MailingStatus from 'App/Models/MailingStatus'
import Chat from 'App/Models/Chat'


export default class Mailing extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public message: String

  @column.date({
    serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
  })
  public requiredStartAt: DateTime

  @column.date({
    serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
  })
  public actualStartAt: DateTime | null

  @column.date({
    serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
  })
  public endAt: DateTime | null

  @column()
  public photos: string

  @column()
  public inlineKeyboard: string | null

  @column()
  public replyKeyboard: string | null

  @column()
  public botId: number

  @column()
  public statusId: number

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime


  @beforeSave()
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
    mailing.photos = JSON.parse(mailing.photos)
    if (mailing.inlineKeyboard !== null)
      mailing.inlineKeyboard = JSON.parse(mailing.inlineKeyboard)

    if (mailing.replyKeyboard !== null)
      mailing.replyKeyboard = JSON.parse(mailing.replyKeyboard)

  }

  @belongsTo(() => Bot)
  public bot: BelongsTo<typeof Bot>

  @belongsTo(() => MailingStatus)
  public status: BelongsTo<typeof MailingStatus>

  @hasMany(() => Chat)
  public chats: HasMany<typeof Chat>
}
