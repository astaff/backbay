import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { trainRoutes } from './server/routes/train.js'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*'
    if (origin === 'https://backbay.astaff.io') return origin
    if (origin.endsWith('.backbay.pages.dev')) return origin
    return false
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// API routes
app.route('/api/train', trainRoutes)

app.get('/api', (c) => {
  return c.json({ status: 'ok', message: 'BackBay API Server' })
})

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'BackBay API Server' })
})

export default app