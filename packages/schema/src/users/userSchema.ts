import { createInsertSchema } from 'drizzle-zod'
import { usersTable } from '../db/userDbSchema'
import { z } from 'zod'
import { UTCDate } from '@date-fns/utc'

const UsersSchemaBase = createInsertSchema(usersTable, {
    createdAt: z.date().default(new UTCDate()),
    updatedAt: z.date().default(new UTCDate()),
})

export const UsersSchema = UsersSchemaBase.extend({
    role: UsersSchemaBase.shape.role.default('none'),
})

export type UsersSchemaType = z.infer<typeof UsersSchema>
export type UserRoleType = NonNullable<Pick<UsersSchemaType, 'role'>['role']>
