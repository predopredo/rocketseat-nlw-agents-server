import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  const { questions } = schema

  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(10),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const result = await db
        .insert(questions)
        .values({
          roomId,
          question,
        })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create new room')
      }

      return reply.status(201).send({
        id: insertedQuestion.id,
      })
    }
  )
}
