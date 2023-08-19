import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Mailing from 'App/Models/Mailing'
export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public mailingId: number

  @column()
  public chatId: string

  @column.date({
    serialize: (value) => value.toFormat('dd.mm.yyyy HH:mm')
  })
  public sentAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Mailing)
  public mailing: BelongsTo<typeof Mailing>
}
