import { getAuth } from '@hono/clerk-auth';
import { createMiddleware } from 'hono/factory';
import type { User } from '@clerk/backend';
import { getUserCache, setUserCache } from '@/server/caching/userCache';

export type UserVar = {
    Variables: {
        user: User;
    };
};

export const clerkUserMiddleware = createMiddleware<UserVar>(async (c, next) => {
    try {
        const auth = getAuth(c);
        const userId = auth?.userId;

        if (!userId) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const clerkClient = c.get('clerk');

        let user = await getUserCache(userId);

        user ??= await clerkClient.users.getUser(userId);
        c.set('user', user);

        setUserCache(userId, user);
        await next();
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Unauthorized' }, 401);
    }
});
