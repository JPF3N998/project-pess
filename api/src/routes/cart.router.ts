import { Router } from 'express'
import { Handlers } from '../handlers/index.js'

const { ShoppingCart } = Handlers

const router = Router()

router.get('/', ShoppingCart.getShoppingCartProducts)

router.post('/', ShoppingCart.addProductToCart)

router.delete('/:productId', ShoppingCart.removeProduct)

export default router
