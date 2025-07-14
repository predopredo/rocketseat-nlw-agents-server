import { and, eq, sql } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbeddings } from '../../services/genAi.ts'

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

      const embeddings = await generateEmbeddings(question)

      // todo fix this in the service and db
      const embeddingsAsStrgin = `[${embeddings.join(',')}]`

      const similarity = sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsStrgin}::vector)`
      const similarityThreshold = 0.7

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcript: schema.audioChunks.transcript,
          similarity,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`${similarity} > ${similarityThreshold}`
          )
        )
        .orderBy(similarity)
        .limit(3)

      let answer: string | null = null

      if (chunks.length > 0) {
        const transcripts = chunks.map((chunk) => chunk.transcript)

        answer = await generateAnswer(question, transcripts)
      }

      const result = await db
        .insert(questions)
        .values({
          roomId,
          question,
          answer,
        })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create new room')
      }

      return reply.status(201).send({
        id: insertedQuestion.id,
        answer,
      })
    }
  )
}
