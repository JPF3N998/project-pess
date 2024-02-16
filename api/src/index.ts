import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import { Routers } from './routes/index.js'
import { useUserId } from './middleware/useUserId.js'

const app = express()

app.use(morgan('tiny'))
app.use(helmet())
app.use(express.json())

app.use('/:email/cart', useUserId, Routers.ShoppingCart)

app.get('/ping', (_, res) => {
  res.status(200).send('\'Sup?')
})

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log('Listening on', port)
})
