import { start, stop } from '@/api/rest/server'
import { dbConnect, dbDisconnect } from '@/database/prisma'

let isShuttingDown = false

const main = async () => {
  await dbConnect()
  await start()
}

const shutdown = async (error: Error | null, exitCode: number) => {
  if (isShuttingDown) {
    return
  }
  isShuttingDown = true

  if (error) {
    console.error('Server error:', error)
  } else {
    console.log('Shutting down...')
  }

  try {
    await dbDisconnect()
    await stop()
    console.log('Shutdown successfully.')
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }

  process.exit(exitCode)
}

main().catch(async error => {
  await shutdown(error, 1)
})

process.on('SIGINT', async () => {
  await shutdown(null, 0)
})

process.on('SIGTERM', async () => {
  await shutdown(null, 0)
})
