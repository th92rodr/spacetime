import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/database/prisma'

export const memoriesRoutes: FastifyPluginAsyncZod = async app => {
  app.addHook('preHandler', async request => {
    await request.jwtVerify()
  })

  app.route({
    method: 'GET',
    url: '/memories',
    handler: async request => {
      const { sub: userId } = request.user

      const memories = await db.memory.findMany({
        select: { id: true, coverUrl: true, content: true, createdAt: true },
        where: { userId },
        orderBy: { createdAt: 'asc' },
      })

      return memories.map(memory => {
        return {
          id: memory.id,
          cover_url: memory.coverUrl,
          excerpt: memory.content.substring(0, 115).concat('...'),
          created_at: memory.createdAt,
        }
      })
    },
  })

  app.route({
    method: 'GET',
    url: '/memories/:id',
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user
      const { id } = request.params

      const memory = await db.memory.findUnique({
        where: { id },
      })

      if (!memory) {
        return reply.status(404).send()
      }

      if (!memory.isPublic && memory.userId !== userId) {
        return reply.status(401).send()
      }

      return { memory }
    },
  })

  app.route({
    method: 'POST',
    url: '/memories',
    schema: {
      body: z.object({
        content: z.string(),
        cover_url: z.string(),
        is_public: z.coerce.boolean().default(false),
      }),
    },
    handler: async request => {
      const { sub: userId } = request.user
      const { content, cover_url: coverUrl, is_public: isPublic } = request.body

      const memory = await db.memory.create({
        data: { userId, content, coverUrl, isPublic },
      })

      return { memory }
    },
  })

  app.route({
    method: 'PUT',
    url: '/memories/:id',
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        content: z.string(),
        cover_url: z.string(),
        is_public: z.coerce.boolean().default(false),
      }),
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user
      const { id } = request.params
      const { content, cover_url: coverUrl, is_public: isPublic } = request.body

      let memory = await db.memory.findUnique({
        where: { id },
      })

      if (!memory) {
        return reply.status(404).send()
      }

      if (memory.userId !== userId) {
        return reply.status(401).send()
      }

      memory = await db.memory.update({
        where: { id },
        data: { content, coverUrl, isPublic },
      })

      return { memory }
    },
  })

  app.route({
    method: 'DELETE',
    url: '/memories/:id',
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user
      const { id } = request.params

      const memory = await db.memory.findUnique({
        where: { id },
      })

      if (!memory) {
        return reply.status(404).send()
      }

      if (memory.userId !== userId) {
        return reply.status(401).send()
      }

      await db.memory.delete({
        where: { id },
      })
    },
  })
}
