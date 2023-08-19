import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import MailingStatuses from "App/Enums/MailingStatuses";

export default class extends BaseSchema {
  protected tableName = 'mailings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('message', 1024).notNullable()
      table.dateTime('required_start_at').notNullable()
      table.dateTime('actual_start_at').nullable()
      table.dateTime('end_at').nullable()
      table.json('photos')
      table.json('inline_keyboard').nullable()
      table.json('reply_keyboard').nullable()
      table.integer('bot_id').unsigned()
        .references('id').inTable('bots').notNullable()
      table.integer('status_id').unsigned()
        .references('id').inTable('mailing_statuses')
        .notNullable().defaultTo(MailingStatuses.PENDING)


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
