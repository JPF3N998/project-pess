import { Router } from 'express'
import { Handlers } from '../handlers/index.js'

const { ShoppingCart } = Handlers

const router = Router()

// C
router.post('/', ShoppingCart.addProductToCart)

// U
router.patch('/', ShoppingCart.updateProductQuantity)

// R
router.get('/', ShoppingCart.getShoppingCartProducts)

// D
router.delete('/:productId', ShoppingCart.removeProduct)

export default router
