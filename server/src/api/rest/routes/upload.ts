import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

const pump = promisify(pipeline)

export const uploadRoutes: FastifyPluginAsyncZod = async app => {
  app.route({
    method: 'POST',
    url: '/upload',
    handler: async (request, reply) => {
      const upload = await request.file({
        limits: { fileSize: 5_242_880 }, // 5mb
      })

      if (!upload) {
        return reply.status(400).send()
      }

      const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
      const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

      if (!isValidFileFormat) {
        return reply.status(400).send()
      }

      const fileId = randomUUID()
      const extension = extname(upload.filename)
      const filename = fileId.concat(extension)

      const writeStream = createWriteStream(resolve(__dirname, '../../uploads/', filename))

      await pump(upload.file, writeStream)

      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString()

      return { file_url: fileUrl }
    },
  })
}
