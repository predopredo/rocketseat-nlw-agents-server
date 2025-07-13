import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

// Filter out audioChunks as it contains vector columns not supported by drizzle-seed
const { audioChunks: _audioChunks, ...seedableSchema } = schema

await reset(db, schema)
await seed(db, seedableSchema).refine((faker) => ({
  rooms: {
    count: 5,
    columns: {
      name: faker.companyName(),
      description: faker.loremIpsum(),
    },
    with: {
      questions: 1,
    },
  },
  questions: {
    count: 5,
    columns: {
      question: faker.loremIpsum(),
      answer: faker.loremIpsum(),
    },
  },
}))
await sql.end()

// biome-ignore lint/suspicious/noConsole: dev logs
console.log('Seeded database')
