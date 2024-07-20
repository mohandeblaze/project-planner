import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import type { User } from '@clerk/backend'
import { ClerkUserCache } from '../caching/clerkUserCache'

export type UserVar = {
    Variables: {
        user: User
    }
}

export const clerkUserMiddleware = () => {
    return middleware
}

const middleware = createMiddleware<UserVar>(async (c, next) => {
    try {
        const auth = getAuth(c)
        const userId = auth?.userId

        if (!userId) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const clerkClient = c.get('clerk')

        let user = await ClerkUserCache.instance.get(userId)

        user ??= await clerkClient.users.getUser(userId)
        c.set('user', user)

        ClerkUserCache.instance.set(userId, user)
        await next()
    } catch (e) {
        console.error(e)
        return c.json({ error: 'Unauthorized' }, 401)
    }
})
