import { restServer } from '@/api/rest/server'
import { env } from '@/env'
import { dbConnect, dbDisconnect } from '@/lib/prisma'

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
