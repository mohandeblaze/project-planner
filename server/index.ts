import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from './app'
import { UTCDate } from '@date-fns/utc'

const port = 8080

serve({
    fetch: app.fetch,
    port,
}).addListener('listening', () => {
    console.log(
        `${new UTCDate().toISOString()}: Server is running on port http://localhost:${port}`,
    )
})
