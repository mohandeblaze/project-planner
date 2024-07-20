import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { authMiddleware } from './middleware/authMiddleware'
import { corsMiddleware } from './middleware/corsMiddleware'
import { userEnabledMiddleware } from './middleware/userEnabledMiddleware'
import { topicRoute } from './routes/topicRoute'
import './userSync'

const app = new Hono({
    strict: true,
})

app.use('*', logger())
app.use(trimTrailingSlash())
app.use(corsMiddleware())
app.use(clerkMiddleware())
app.use(authMiddleware())
app.use(userEnabledMiddleware())

const apiRoutes = app.basePath('/api').route('/topics', topicRoute)

// fallback route
app.use('*', async (c) => {
    return c.json({ message: 'Not Found' }, 404)
})

export default app
export type ApiRoutes = typeof apiRoutes
