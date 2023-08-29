import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'chats'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('mailing_id').unsigned().references('id')
                .inTable('mailings').onDelete('cascade').notNullable()
            table.string('chat_id', 15).notNullable()
            table.dateTime('sent_at').nullable()
            table.integer('mailing_version').defaultTo(0)
                .comment('необходимо для проверки, изменялась ли рассылка при выполнении в потоке')

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', {useTz: true})
            table.timestamp('updated_at', {useTz: true})
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
