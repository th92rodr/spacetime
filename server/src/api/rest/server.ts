import { resolve } from 'node:path'
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

export const restServer = (): FastifyInstance => {
  const server = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'info' : 'error',
    },
  }).withTypeProvider<ZodTypeProvider>()

  // Setup CORS
  server.register(cors, {
    origin: '*',
  })

  // Setup JWT
  server.register(jwt, {
    secret: 'TOP_SECRET',
  })

  // Setup the API to serve static files
  server.register(fastifyStatic, {
    root: resolve(__dirname, '../../../uploads'),
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

  return server
}
