import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import type { DbUserMiddleware } from './dbUserMiddleware'

export function userEnabledMiddleware() {
    return middleware()
}

function middleware() {
    return createMiddleware<DbUserMiddleware>(async (c, next) => {
        try {
            const auth = getAuth(c)
            const userId = auth?.userId

            if (userId == null) {
                return c.json({ message: 'Unauthorized' }, 401)
            }

            const user = c.var?.dbUser
            const isEnabled = user?.enabled === true && user.banned === false

            if (!isEnabled) {
                return c.json({ type: 'inactiveUser', error: 'Access denied' }, 403)
            }

            await next()
        } catch (e) {
            console.error(e)
            return c.json({ error: 'Unauthorized' }, 401)
        }
    })
}
