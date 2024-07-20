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

export function dbUserMiddleware(options: { useCache: boolean }) {
    return middleware(options.useCache)
}

function middleware(useCache: boolean) {
    return createMiddleware<DbUserMiddleware>(async (c, next) => {
        try {
            const auth = getAuth(c)
            const userId = auth?.userId

            if (userId == null) {
                return c.json({ message: 'Unauthorized' }, 401)
            }

            let user: UsersSchemaType | undefined = useCache
                ? await DbUserCache.instance.get(userId)
                : undefined

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
                    useCache && (await DbUserCache.instance.set(userId, result))
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
}
