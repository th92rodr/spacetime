import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '@/env'
import { authRoutes } from '@/routes/auth'
import { memoriesRoutes } from '@/routes/memories'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(cors, {
  origin: '*',
})

app.register(jwt, {
  secret: 'TOP_SECRET',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(authRoutes)
app.register(memoriesRoutes)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running')
})
