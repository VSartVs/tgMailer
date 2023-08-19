import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import MailingStatuses from "App/Enums/MailingStatuses";

export default class extends BaseSchema {
  protected tableName = 'mailing_statuses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id : MailingStatuses.PENDING,
          title: 'В очереди'
        },
        {
          id : MailingStatuses.ACTIVE,
          title: 'Выполняется'
        },
        {
          id : MailingStatuses.COMPLETED,
          title: 'Завершена'
        }
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
