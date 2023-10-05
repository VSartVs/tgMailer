import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Bot from 'App/Models/Bot'

export default class BlockChat extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public chatId: string

  @column()
  public status: string

  @column({serializeAs: null})
  public botId: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('dd.LL.yyyy HH:mm')
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Bot)
  public bot: BelongsTo<typeof Bot>
}
