import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany, scope} from '@ioc:Adonis/Lucid/Orm'
import Mailing from 'App/Models/Mailing'

export default class Bot extends BaseModel {

  public serializeExtras() {
    return {
      countQueueMailings: this.$extras.countQueueMailings,
      countActiveMailings: this.$extras.countActiveMailings,
    }
  }

  public static countMailings = scope((query, statusId: number, fieldName: string) => {
    query.withCount('mailings', (query) => {
      query.where({statusId: statusId}).as(fieldName)
    })
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public token: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Mailing)
  public mailings: HasMany<typeof Mailing>
}
