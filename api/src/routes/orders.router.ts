import { Router } from 'express'
import { Handlers } from '../handlers/index.js'

const { Orders } = Handlers

const router = Router()

// Orders

router.get('/orders/:orderId?', Orders.getOrders)
router.get('/orders/:orderId/details', Orders.getOrderDetailsById)

export default router
