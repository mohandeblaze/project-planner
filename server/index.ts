import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from './app'
import { UTCDate } from '@date-fns/utc'
import { ServerEnv } from './serverEnv'

const port = 8080

serve({
    fetch: app.fetch,
    port,
}).addListener('listening', () => {
    console.log(
        `${new UTCDate().toISOString()}: Server is running in ${ServerEnv.NODE_ENV} environment on port http://localhost:${port}`,
    )
})
