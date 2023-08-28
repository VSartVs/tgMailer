const mysql = require('mysql2')


function createConnection(){
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
    })
}

async function executeQuery(connection: any, query: string, params: Array<any>) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, function (err, result) {
            return err ? reject(err) : resolve(result)
        })
    })
}

export {createConnection, executeQuery}
