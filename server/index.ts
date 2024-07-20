import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from './app'

const port = 8080

serve({
    fetch: app.fetch,
    port,
}).addListener('listening', () => {
    console.log(`Server is running on port http://localhost:${port}`)
})
