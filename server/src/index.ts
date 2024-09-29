import { restServer } from '@/api/rest/server'
import { dbConnect, dbDisconnect } from '@/database/prisma'
import { env } from '@/env'

const start = async () => {
  await dbConnect()

  const server = restServer()
  try {
    await server.listen({ host: env.HOST, port: env.PORT })
    console.log(`HTTP server listening at: http://${env.HOST}:${env.PORT}`)
  } catch (error) {
    server.log.error('Failed starting HTTP server.')
    throw error
  }
}

start().catch(async error => {
  console.error(error)
  await dbDisconnect()
  process.exit(1)
})
