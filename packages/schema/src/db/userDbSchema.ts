import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    email: varchar('email').notNull(),
})
