import { getAuth } from '@hono/clerk-auth'
import { UserDbSchema, type UsersSchemaType } from '@project-planner/shared-schema'
import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import { DbUserCache } from '../caching/dbUserCache'
import { dbClient } from '../db-client'

export type DbUserMiddleware = {
    Variables: {
        dbUser: UsersSchemaType
    }
}

export const dbUserMiddleware = () => {
    return middleware
}

const middleware = createMiddleware<DbUserMiddleware>(async (c, next) => {
    try {
        const auth = getAuth(c)
        const userId = auth?.userId

        if (userId == null) {
            return c.json({ message: 'Unauthorized' }, 401)
        }

        let user = await DbUserCache.instance.get(userId)

        if (user == null) {
            const result = await dbClient.query.usersTable.findFirst({
                columns: {
                    enabled: true,
                    banned: true,
                    role: true,
                },
                where: eq(UserDbSchema.usersTable.id, userId),
            })

            if (result) {
                await DbUserCache.instance.set(userId, result)
                user = result as UsersSchemaType
            }
        }

        c.set('dbUser', user as UsersSchemaType)

        await next()
    } catch (e) {
        console.error(e)
        return c.json({ error: 'Unauthorized' }, 401)
    }
})
