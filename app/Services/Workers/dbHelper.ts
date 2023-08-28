const mysql = require('mysql2')
const logger = require('../../../logger')

class DbHelper {
    private connection: typeof mysql.createConnection | null = null

    constructor() {
        this.createConnection()
        this.connection.on('error', async (error) => {
            if(error.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                await this.pingConnection()                         // lost due to either server restart, or a
            } else {
                logger.error(error)
            }
        });
    }

    private createConnection() {

        this.connection = mysql.createConnection({
            connectionLimit: Number(process.env.NUMBER_OF_THREADS) + 1,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB_NAME,
        })
    }

    private async execute(query: string, params: Array<any>) {

        return new Promise((resolve, reject) => {
            return this.connection.query(query, params, function (err, result) {
                return err ? reject(err) : resolve(result)
            })
        })
    }

    public async executeQuery(query: string, params: Array<any>){
        return await this.execute(query, params).catch(error => {
            console.log('catch in DBHelper')
            console.log(error)
            logger.error({function: 'dbHelper.executeQuery'}, error)
            this.pingConnection()
            return this.executeQuery(query, params)

        })
    }

    private async pingConnection() {
        const disconnected = await new Promise(resolve => {
            this.connection.ping(error => {
                resolve(error);
            });
        });
        if (disconnected) {
            this.createConnection()
        }
        return disconnected
    }

    public async closeConnection() {

        this.connection.end()
    }
}

export default new DbHelper()
