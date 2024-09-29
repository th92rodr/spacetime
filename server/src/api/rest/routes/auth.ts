import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  app.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: z.object({
        code: z.string(),
      }),
    },
    handler: async request => {
      const { code } = request.body

      const url = `https://github.com/login/oauth/access_token?client_id=${env.GITHUB_CLIENT_ID}&client_secret=${env.GITHUB_CLIENT_SECRET}&code=${code}`

      const accessTokenResponse = await fetch(url, {
        method: 'POST',
        body: null,
        headers: { Accept: 'application/json' },
      })

      interface AccessTokenResponse {
        access_token: string
        scope: string
        token_type: string
      }

      const { access_token: accessToken } =
        (await accessTokenResponse.json()) as AccessTokenResponse

      const userResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      interface UserResponse {
        id: number
        login: string
        name: string
        avatar_url: string
      }

      const {
        id: githubId,
        login,
        name,
        avatar_url: avatarUrl,
      } = (await userResponse.json()) as UserResponse

      let userDb = await prisma.user.findUnique({
        where: { githubId },
      })

      if (!userDb) {
        userDb = await prisma.user.create({
          data: { githubId, login, name, avatarUrl },
        })
      }

      const token = app.jwt.sign(
        {
          name: userDb.name,
          avatarUrl: userDb.avatarUrl,
        },
        {
          sub: userDb.id,
          expiresIn: '30 days',
        }
      )

      return { token }
    },
  })
}
