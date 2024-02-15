import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

const app = express()

app.use(morgan('tiny'))
app.use(helmet())

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log('Listening on', port)
})
