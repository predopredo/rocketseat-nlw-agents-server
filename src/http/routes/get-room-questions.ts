import { desc, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  const { questions } = schema

  app.get(
    '/rooms/:id/questions',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request) => {
      const { id } = request.params

      const result = await db
        .select({
          id: questions.id,
          question: questions.question,
          answer: questions.answer,
          createdAt: questions.createdAt,
        })
        .from(questions)
        .where(eq(questions.roomId, id))
        .orderBy(desc(questions.createdAt))

      return result
    }
  )
}
