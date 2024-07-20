import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { corsMiddleware } from './middleware/corsMiddleware'
import { topicRoute } from './routes/topicRoute'
import './userSync'

const app = new Hono({
    strict: true,
})

app.use('*', logger())
app.use(trimTrailingSlash())
app.use(corsMiddleware())

const apiRoutes = app.basePath('/api').route('/topics', topicRoute)

// fallback route
app.use('*', async (c) => {
    return c.json({ message: 'Not Found' }, 404)
})

export default app
export type ApiRoutes = typeof apiRoutes
