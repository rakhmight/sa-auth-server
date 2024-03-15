import { getDate } from "../utils/getDate"

const pino = require('pino')
const path = require('path')

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: {
        destination: path.join(__dirname, `../logs/logs-${getDate()}.log`),
      }
    },
    {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  ]
})

export const fastifyConfig = {
    logger: pino(
      transport
    ),
    bodyLimit: 100 * 1024 * 1024 // Default Limit set to 1000MB
}