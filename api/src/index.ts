import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import { Routers } from './routes/index.js'
import { useUserId } from './middleware/useUserId.js'
import { useShoppingCart } from './middleware/useShoppingCart.js'

const app = express()

const loggingMode = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'

app.use(morgan(loggingMode))
app.use(helmet())
app.use(express.json())

app.use('/:email/cart/products', useUserId, useShoppingCart, Routers.ShoppingCart)

app.get('/ping', (_, res) => {
  res.status(200).send('\'Sup?')
})

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log('Listening on', port)
})
