import { count, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  const { rooms, questions } = schema

  app.get('/rooms', async () => {
    const results = await db
      .select({
        id: rooms.id,
        name: rooms.name,
        questionsCount: count(questions.id),
        createdAt: rooms.createdAt,
      })
      .from(rooms)
      .leftJoin(questions, eq(rooms.id, questions.roomId))
      .groupBy(rooms.id, rooms.name)
      .orderBy(rooms.createdAt)

    return results
  })
}
