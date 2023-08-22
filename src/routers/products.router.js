import { Router } from "express"
import { auth } from "../controllers/session.controller.js"
import { createProductController, deleteProductController, productIdViewsController, productViewsController, updateProductController } from "../controllers/product.controller.js"


const router = Router()

// endpoint to view the products
router.get('/', auth, productViewsController)

// endpoint to view one specific product
router.get('/:idProduct', auth, productIdViewsController)

// enpoint to create a product
router.post('/', createProductController)

// endpoint to update a product
router.put('/:id', updateProductController)

// endpoint to delete a product
router.delete('/:id',deleteProductController)

export default router