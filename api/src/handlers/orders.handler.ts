import { Request, Response } from 'express'
import { Order, ProductsInOrder } from '../sequelize/models/Order.js'
import { RequestWithUserShoppingCart } from '../middleware/useShoppingCart.js'
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js'
import { Model } from 'sequelize'

interface RequestParams {
   orderId?: number
}

async function getOrders(req: Request<RequestParams>, res: Response) {
  const { orderId } = req.params

  const { shoppingCart } = (req as RequestWithUserShoppingCart)

  let results: Model[] = [];

  if (!orderId) { // Return all user's orders    
    results = await Order.findAll({
      attributes: ['id', 'total', 'createdAt'],
      where: {
        cartId: shoppingCart.id
      }
    })
  } else { // Return specific order by its order ID
    results = await Order.findAll({
      attributes: ['id', 'total', 'createdAt'],
      where: {
        cartId: shoppingCart.id,
        id: orderId
      }
    })
  }

  // Return result
  res.status(HTTP_STATUS_CODES.OK).json({ orders: results })
}

async function getOrderDetailsById(req: Request<RequestParams>, res: Response) {
  const { orderId } = req.params

  if (!orderId) {
    return res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST)
  }

  const { shoppingCart } = (req as RequestWithUserShoppingCart)

  const order = await Order.findOne({
    attributes: ['id', 'total', 'createdAt'],
    where: {
      id: orderId,
      cartId: shoppingCart.id
    }
  })

  const products = await ProductsInOrder.findAll({
    attributes: ["productName", "quantity", "price"],
    where: {
      orderId
    }
  })

  res
    .status(HTTP_STATUS_CODES.OK)
    .json({ details: { order, products }})
}

export default {
  getOrders,
  getOrderDetailsById
}