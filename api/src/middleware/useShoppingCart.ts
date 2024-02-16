import { NextFunction, Request, Response, Router } from 'express';
import { usePrisma } from '../prisma/useClient.js';
import { ShoppingCart } from '@prisma/client';
import { RequestWithUserId } from './useUserId.js';
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js';

export interface RequestWithUserShoppingCart extends RequestWithUserId {
  shoppingCart: ShoppingCart
}

/**
 * Decorates request with user's `shoppingCart`
 */
export async function useShoppingCart(req: RequestWithUserShoppingCart, res: Response, next: NextFunction) {
  const { userId } = req as RequestWithUserShoppingCart

  const client = usePrisma()

  // Get user's shopping cart
  const shoppingCart = await client.shoppingCart.findUnique({
    select: { id: true, ownerId: true },
    where: { ownerId: userId }
  })

  if (!shoppingCart) {
    res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND)
    return
  }
  
  req.shoppingCart = shoppingCart

  next()
}
