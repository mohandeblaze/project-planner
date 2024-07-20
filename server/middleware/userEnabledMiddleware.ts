import { getAuth } from '@hono/clerk-auth'
import { UserDbSchema } from '@project-planner/shared-schema'
import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import { DbUserCache } from '../caching/dbUserCache'
import { dbClient } from '../db-client'

export const userEnabledMiddleware = () => {
    return middleware
}

const middleware = createMiddleware(async (c, next) => {
    try {
        const auth = getAuth(c)
        const userId = auth?.userId

        if (!userId) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const user = await DbUserCache.instance.get(userId)
        let isEnabled = user?.enabled === true && user.banned === false

        if (user == null) {
            const result = await dbClient.query.usersTable.findFirst({
                columns: {
                    enabled: true,
                    banned: true,
                },
                where: eq(UserDbSchema.usersTable.id, userId),
            })

            if (result) {
                await DbUserCache.instance.set(userId, result)
            } else {
                return c.json({ error: 'Unknown user' }, 403)
            }

            isEnabled = result?.enabled === true && result.banned === false
        }

        if (!isEnabled) {
            return c.json({ error: 'Access denied' }, 403)
        }

        await next()
    } catch (e) {
        console.error(e)
        return c.json({ error: 'Unauthorized' }, 401)
    }
})
