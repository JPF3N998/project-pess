import { Sequelize, DataTypes, ModelDefined, Optional } from 'sequelize'

if (!process.env.DATABASE_URL) {
  throw Error('No connection string to database')
}

const sequelize = new Sequelize(process.env.DATABASE_URL)

interface OrderAttributes {
  id: number
  cartId: number
  total: number
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id'>

export const Order: ModelDefined<OrderAttributes, OrderCreationAttributes> = sequelize.define('Order', {
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
  },
  total: {
    type: DataTypes.DECIMAL,
    comment: 'Order total'
  }
})

interface ProductsInOrderAttributes {
  id: number
  orderId: number
  productName: string
  quantity: number
  price: number
}

type ProductsInOrderCreationAttributes = Optional<ProductsInOrderAttributes, 'id'>


// Could use Cart.hasMany(Product) but product is done by Prisma
// Opting for manual binding
export const ProductsInOrder: ModelDefined<ProductsInOrderAttributes, ProductsInOrderCreationAttributes> = sequelize.define('ProductsInOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    comment: 'Products associated to an order'
  },
  // Expand product here. If actual product row is removed, there are no side-effects
  // to an already-generated order
  productName: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DECIMAL
  }
})

ProductsInOrder.belongsTo(Order, {
  foreignKey: 'orderId'
})

// Opting for runtime syncing instead of recommended migration approach
// due to blocker described at the end of this file
// Recommendation: https://sequelize.org/docs/v6/core-concepts/model-basics/#synchronization-in-production

export async function sync() {
  await sequelize.sync()
}

/**
 * Migrations via CLI References
 * Blocker ATM: CLI expects CommonJS, JS models. But not TS.
 * Need to tsc models into JS and then the CLI migrate tool.
 * - https://github.com/sequelize/cli/blob/main/docs/README.md
 * - https://medium.com/@samratshaw/sequelize-cli-migrations-with-typescript-bd1bd41cbd6
 */