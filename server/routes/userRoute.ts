import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/authMiddleware'
import { dbUserMiddleware } from '../middleware/dbUserMiddleware'
import { userEnabledMiddleware } from '../middleware/userEnabledMiddleware'
import { adminRoles, userRoleMiddleware } from '../middleware/userRoleMiddleware'
import { synchronizeUsers } from '../userSync'

export const userRoute = new Hono()
    .use(clerkMiddleware())
    .use(authMiddleware())
    .use(dbUserMiddleware({ useCache: false }))
    .use(userEnabledMiddleware())
    .use(userRoleMiddleware(adminRoles))
    .post('/sync', async (c) => {
        await synchronizeUsers()

        return c.json({ message: 'Synced' }, 200)
    })
