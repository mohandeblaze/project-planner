import type { User } from '@clerk/backend'
import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import { ClerkUserCache } from '../caching/clerkUserCache'

export type ClerkMiddlewareVar = {
    Variables: {
        user: User
    }
}

export function clerkUserMiddleware() {
    return middleware()
}

function middleware() {
    return createMiddleware<ClerkMiddlewareVar>(async (c, next) => {
        try {
            const auth = getAuth(c)
            const userId = auth?.userId

            if (!userId) {
                return c.json({ error: 'Unauthorized' }, 401)
            }

            const clerkClient = c.get('clerk')

            let user = await ClerkUserCache.instance.get(userId)

            if (!user) {
                user = await clerkClient.users.getUser(userId)
                ClerkUserCache.instance.set(userId, user)
            }

            c.set('user', user)

            await next()
        } catch (e) {
            console.error(e)
            return c.json({ error: 'Unauthorized' }, 401)
        }
    })
}
