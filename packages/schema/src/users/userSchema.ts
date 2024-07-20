import { createInsertSchema } from 'drizzle-zod'
import { usersTable } from '../db/userSchema'
import type { z } from 'zod'

export const UsersSchema = createInsertSchema(usersTable)

export type UsersSchemaType = z.infer<typeof UsersSchema>
