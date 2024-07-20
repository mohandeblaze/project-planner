import { getAuth } from '@hono/clerk-auth'
import type { UserRoleType } from '@project-planner/shared-schema'
import { createMiddleware } from 'hono/factory'
import type { DbUserMiddleware } from './dbUserMiddleware'

export const memberRoles: UserRoleType[] = ['developer', 'tester']
export const adminRoles: UserRoleType[] = ['teamAdmin', 'superAdmin']
export const validRoles: UserRoleType[] = [...memberRoles, ...adminRoles]

export function userRoleMiddleware(roles: UserRoleType[]) {
    return middleware(roles)
}

function middleware(roles: UserRoleType[]) {
    return createMiddleware<DbUserMiddleware>(async (c, next) => {
        try {
            const auth = getAuth(c)
            const userId = auth?.userId!

            if (userId == null) {
                return c.json({ message: 'Unauthorized' }, 401)
            }

            const user = c.var?.dbUser

            if (user?.role == null || !roles.includes(user?.role)) {
                console.log('Invalid role', user?.role)
                return c.json({ type: 'invalidRole', error: 'Access denied' }, 403)
            }

            await next()
        } catch (e) {
            console.error(e)
            return c.json({ error: 'Unauthorized' }, 401)
        }
    })
}
