import { Router } from 'express'
import { Handlers } from '../handlers/index.js'

const { ShoppingCart } = Handlers

const router = Router()

// Products
// C
router.post('/products', ShoppingCart.addProductToCart)

// U
router.patch('/products', ShoppingCart.updateProductQuantity)

// R
router.get('/products', ShoppingCart.getShoppingCartProducts)

// D
router.delete('/products/:productId', ShoppingCart.removeProduct)

// Orders
router.post('/checkout', ShoppingCart.checkout)

export default router
