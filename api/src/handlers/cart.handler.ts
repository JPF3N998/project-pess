import { Request, Response } from 'express'
import { Product } from '@prisma/client'
import { usePrisma } from '../prisma/useClient.js'
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js'
import { RequestWithUserShoppingCart } from '../middleware/useShoppingCart.js'

async function getShoppingCartProducts (req: Request, res: Response) {
  const { shoppingCart } = (req as RequestWithUserShoppingCart)

  const client = usePrisma()

  const products = await client.productsOnShoppingCart.findMany({
    select: {
      product: { select: { id: true, name: true } },
      quantity: true
    },
    where: {
      shoppingCartId: shoppingCart.id
    }
  })

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


export default {
  addProductToCart,
  getShoppingCartProducts,
  removeProduct,
}
