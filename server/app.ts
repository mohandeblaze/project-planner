import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { corsMiddleware } from './middleware/corsMiddleware'
import { topicRoute } from './routes/topicRoute'
import './userSync'
import { userRoute } from './routes/userRoute'
import { editTopicRoute } from './routes/editTopicRoute'

const app = new Hono({
    strict: true,
})

app.use('*', logger())
app.use(trimTrailingSlash())
app.use(corsMiddleware())

const apiRoutes = app
    .basePath('/api')
    .route('/topics', topicRoute)
    .route('/topic/edit', editTopicRoute)
    .route('/users', userRoute)

// fallback route
app.use('*', async (c) => {
    return c.json({ message: 'Not Found' }, 404)
})

export default app
export type ApiRoutes = typeof apiRoutes
