# NLW Agents - Server

Backend server for the NLW Agents project, developed during a RocketSeat event.

## Tech Stack

- **Runtime**: Node.js 22 with ES modules
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Code Quality**: Biome (formatter/linter)
- **Git Hooks**: Husky

## Project Structure

```
src/
├── server.ts          # Fastify server setup
├── env.ts            # Environment validation with Zod
├── http/
│   └── routes/       # API routes
└── db/
    ├── connection.ts  # Database connection
    ├── schema/        # Drizzle schema definitions
    └── migrations/    # Database migrations
```

## Key Patterns

- **Type Safety**: Full TypeScript with Zod validation
- **Database**: Type-safe queries with Drizzle ORM
- **API**: RESTful routes with Fastify
- **Environment**: Strict environment variable validation
- **Code Style**: Biome for formatting and linting

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables** (create `.env`):

   ```
   PORT=3333
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5433
   POSTGRES_DB=agents
   ```

3. **Database setup**:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

## Docker

Run with Docker Compose:

```bash
docker-compose up
```

## Scripts

- `npm run dev` - Development server with hot reload
- `npm run start` - Production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate new migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Drizzle Studio

## API Endpoints

- `GET /health` - Health check
- `GET /rooms` - List all rooms
