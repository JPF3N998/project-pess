import { Sequelize, DataTypes } from 'sequelize'

if (!process.env.DATABASE_URL) {
  throw Error('No connection string to database')
}

const sequelize = new Sequelize(process.env.DATABASE_URL)

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Order ID, auto-generated'
  },
  // Crazy moment: Linking Prisma-generated table to this FK
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: { tableName: 'ShoppingCart' },
      key: 'ownerId'
    },
    comment: 'Shopping cart ID associated to this order'
  }
})

// Could use Cart.hasMany(Product) but product is done by Prisma
// Opting for manual binding
const ProductsInOrder = sequelize.define('ProductsInOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id'
    },
    comment: 'Products associated to an order'
  },
  // Expand product here. If actual product row is removed, there are no side-effects
  // to an already-generated order
  productName: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DECIMAL
  }
})

// Opting for runtime syncing instead of recommended migration approach
// due to blocker described at the end of this file
// Recommendation: https://sequelize.org/docs/v6/core-concepts/model-basics/#synchronization-in-production

sequelize
  .sync()
  .then(() => {
    console.log('Models synced successfully.')
  })
  .catch(err => console.error(err))

/**
 * Migrations via CLI References
 * Blocker ATM: CLI expects CommonJS, JS models. But not TS.
 * Need to tsc models into JS and then the CLI migrate tool.
 * - https://github.com/sequelize/cli/blob/main/docs/README.md
 * - https://medium.com/@samratshaw/sequelize-cli-migrations-with-typescript-bd1bd41cbd6
 */