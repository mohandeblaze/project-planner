import { pgTable, text, timestamp, varchar, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const userRolePgEnum = pgEnum('userRoles', [
    'none',
    'developer',
    'tester',
    'teamAdmin',
    'superAdmin',
])

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    email: varchar('email').notNull(),
    fullName: varchar('fullName').notNull(),
    firstName: varchar('firstName').notNull(),
    lastName: varchar('lastName').notNull(),
    banned: boolean('banned').notNull(),
    enabled: boolean('enabled').notNull().default(false),
    role: userRolePgEnum('role').notNull().default('none'),
})
