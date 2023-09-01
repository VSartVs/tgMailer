import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Mailing from 'App/Models/Mailing'

export default class MailingStatus extends BaseModel {
  @column({ isPrimary: true, serializeAs: null})
  public id: number

  @column()
  public title: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Mailing)
  public mailings: HasMany<typeof Mailing>
}
