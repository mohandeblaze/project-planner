import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'

export function authMiddleware() {
    return middleware
}

const middleware = createMiddleware(async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    return next()
})
