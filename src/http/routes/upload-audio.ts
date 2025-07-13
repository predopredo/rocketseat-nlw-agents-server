import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateEmbeddings, transcribeAudio } from '../../services/genAi.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const audio = await request.file()

      if (!audio) {
        throw new Error('No audio file uploaded')
      }

      const buffer = await audio.toBuffer()
      const base64Audio = buffer.toString('base64')

      const transcript = await transcribeAudio(base64Audio, audio.mimetype)
      const embeddings = await generateEmbeddings(transcript)

      // biome-ignore lint/suspicious/noConsole: yes
      console.log(roomId, transcript)
      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcript,
          embeddings,
        })
        .returning()

      const chunk = result[0]

      if (!chunk) {
        throw new Error('Failed to insert audio chunk')
      }

      return reply.status(201).send({ chunkId: chunk.id })
    }
  )
}
