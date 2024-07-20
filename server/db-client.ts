import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { ServerEnv } from './serverEnv'
import { TopicDbSchema, UserDbSchema } from '@project-planner/shared-schema'

const client = postgres(ServerEnv.DB_URL)
export const dbClient = drizzle(client, {
    schema: {
        ...TopicDbSchema,
        ...UserDbSchema,
    },
})
