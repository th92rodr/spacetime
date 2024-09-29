import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import Fastify, { type FastifyInstance } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { authRoutes } from '@/api/rest/routes/auth'
import { memoriesRoutes } from '@/api/rest/routes/memories'
import { uploadRoutes } from '@/api/rest/routes/upload'
import { env } from '@/env'

let server: FastifyInstance

export async function start() {
  if (server) {
    console.log('HTTP server already started.')
    return
  }

  server = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'info' : 'error',
    },
  }).withTypeProvider<ZodTypeProvider>()

  // Setup CORS
  server.register(cors, {
    origin: env.CORS_ORIGIN,
  })

  // Setup JWT
  server.register(jwt, {
    secret: env.JWT_SECRET,
  })

  // Setup the API to serve static files
  server.register(fastifyStatic, {
    root: env.STATIC_FILES_DIR,
    prefix: '/uploads',
  })

  // Setup the API to accept multipart form requests
  server.register(multipart)

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  // Register routes
  server.register(authRoutes)
  server.register(uploadRoutes)
  server.register(memoriesRoutes)

  try {
    await server.listen({ host: env.HOST, port: env.PORT })
    console.log(`HTTP server listening at: http://${env.HOST}:${env.PORT}`)
  } catch (error) {
    server.log.error('Failed starting HTTP server.')
    throw error
  }
}

export async function stop() {
  if (server) {
    await server.close()
    console.log('HTTP server stopped.')
  }
}
