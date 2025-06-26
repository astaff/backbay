import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { trainRoutes } from './routes/train.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.route('/api/train', trainRoutes)

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'BackBay API Server' })
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

console.log(`Server running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})