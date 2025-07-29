import { Hono } from 'hono'

const app = new Hono()

app.get('/status', (c) => {
  return c.json({success:true})
})

export default app
