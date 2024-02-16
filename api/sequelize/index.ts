import { sync } from '../src/sequelize/models/Order.js'

sync()
  .then(() => {
    console.log('Models synced successfully.')
  })
  .catch(err => console.error(err))

