const pino = require('pino')
const path = require('path')

const destinationPath = path.join(__dirname, '/logs/app.log')

const transport = pino.transport({
    target: 'pino/file',
    options: {
        destination: destinationPath,
        colors: true
    }
})

const logger = pino({
        level: process.env.PINO_LOG_LEVEL || 'info',
        formatters: {
            level: (label) => {
                return {
                    type: label.toUpperCase()
                }
            },
        },
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    },
    transport
)

module.exports = logger
