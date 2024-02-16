import { Request, Response } from 'express'
import { RequestWithUserId } from '../middleware/useUserId.js'
import { Prisma } from '@prisma/client'
import { usePrisma } from '../prisma/useClient.js'
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js'

async function getShoppingCartProducts(req: Request, res: Response) {
  const { userId } = (req as RequestWithUserId)

  const prisma = usePrisma()
  
  // Get user's shopping cart
  const shoppingCart = await prisma.shoppingCart.findUnique({
    select: { id: true },
    where: { ownerId: userId }
  })

  if (!shoppingCart) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND)
    return
  }

  const products = await prisma.productsOnShoppingCart.findMany({
    select: {
      product: true
    },
    where: {
      shoppingCartId: shoppingCart.id
    }
  })

  res.status(HTTP_STATUS_CODES.OK).json({ products })
}

async function addProductToCart(req: Request, res: Response) {
  
}

async function removeProduct(req: Request, res: Response) {
  
}

export default {
  addProductToCart,
  getShoppingCartProducts,
  removeProduct
}