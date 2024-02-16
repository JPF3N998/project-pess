import { Request, Response } from 'express'
import { Product, ShoppingCart } from '@prisma/client'
import { usePrisma } from '../prisma/useClient.js'
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js'
import { RequestWithUserShoppingCart } from '../middleware/useShoppingCart.js'
import { useSequelize } from '../sequelize/useClient.js'
import { Order, ProductsInOrder } from '../sequelize/models/Order.js'


const cartProducts = async (shoppingCart: ShoppingCart) => {
  const client = usePrisma()

  const products = await client.productsOnShoppingCart.findMany({
    select: {
      product: true,
      quantity: true
    },
    where: {
      shoppingCartId: shoppingCart.id
    }
  })

  return products
}

const clearCart = async (shoppingCart: ShoppingCart) => {
  const client = usePrisma()

  await client.productsOnShoppingCart.deleteMany({
    where: {
      shoppingCartId: shoppingCart.id
    }
  })
}

async function getShoppingCartProducts (req: Request, res: Response) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)

  const products = await cartProducts(shoppingCart)

  res.status(HTTP_STATUS_CODES.OK).json({ products })
}

type PostAddProductBody = Pick<Product, 'id'> & {
  quantity: number
}

async function addProductToCart (req: Request<{}, {}, PostAddProductBody>, res: Response) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)
  const { id, quantity = 1 } = req.body
  const client = usePrisma()

  const upsertedProduct = await client.productsOnShoppingCart.upsert({
    where: {
      shoppingCartId_productId: {
        shoppingCartId: shoppingCart.id,
        productId: id
      }
    },
    create: {
      productId: id,
      shoppingCartId: shoppingCart.id,
      quantity
    },
    update: {
      quantity: {
        increment: quantity
      }
    }
  })

  res.status(200).json({ product: upsertedProduct })
}

type UpdateProductQuantityBody = Pick<Product, 'id'> & {
  quantity: number
}

async function updateProductQuantity(req: Request<{}, {}, UpdateProductQuantityBody>, res: Response) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)
  const { id, quantity } = req.body

  const client = usePrisma()

  const { quantity: updatedQuantity } = await client.productsOnShoppingCart.update({
    data: {
      quantity
    },
    where: {
      shoppingCartId_productId: {
        productId: id,
        shoppingCartId: shoppingCart.id
      }
    }
  })

  res.status(200).send(`Updated product quantity to ${updatedQuantity}`)
}

type DeleteProductRequest = RequestWithUserShoppingCart & {
  params: {
    productId: number
  }
}

async function removeProduct (
  req: DeleteProductRequest,
  res: Response
) {
  const { shoppingCart } = req
  const { productId } = req.params

  // Ensure casting to int since it's coming from query
  const id = typeof productId === 'string'
    ? parseInt(productId)
    : productId
  
  const client = usePrisma()

  await client.productsOnShoppingCart.delete({
    where: {
      shoppingCartId_productId: {
        productId: id,
        shoppingCartId: shoppingCart.id
      }
    }
  })

  res.sendStatus(200)
}

// Clear Cart
async function clearCartProducts(req: Request, res: Response) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)

  await clearCart(shoppingCart)

  res.sendStatus(HTTP_STATUS_CODES.OK)
}

// Checkout
/**
 * Generate order and clear cart
 * @param req 
 * @param res 
 */
async function checkout(
  req: Request,
  res: Response
) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)
  
  // Gather products
  const productsOnCart = await cartProducts(shoppingCart)

  const products = productsOnCart.map(({quantity, product}) => ({
    quantity,
    productName: product.name,
    price: product.price
  }))

  const total = products.reduce((total, {quantity, price}) => {
    total += quantity * price
    return total
  }, 0)

  const client = useSequelize()

  const t = await client.transaction()
  
  try {
    const newOrder = await Order.create({ 
      cartId: shoppingCart.id,
      total
    })

    const productsOnOrder = products.map(
      ({ productName, quantity, price }) => ({
        orderId: newOrder.dataValues.id,
        productName,
        quantity,
        price
      })
    )

    await ProductsInOrder.bulkCreate(productsOnOrder)
    
    await clearCart(shoppingCart)

    res.status(HTTP_STATUS_CODES.CREATED).json({ order: newOrder.dataValues })
  } catch (error) {
    console.error(error)
    await t.rollback()
  }
}

export default {
  addProductToCart,
  checkout,
  clearCartProducts,
  getShoppingCartProducts,
  removeProduct,
  updateProductQuantity,
}
