import { Router } from "express"
import { auth } from "../controllers/session.controller.js"
import { createProductController, deleteProductController, productIdViewsController, productViewsController, updateProductController } from "../controllers/product.controller.js"
import { handlePolicies } from "../middlewares/auth.middleware.js"

const router = Router()

// endpoint to view the products
router.get('/', auth, handlePolicies(["ADMIN", "USER", "PUBLIC", "PREMIUM"]), productViewsController)

// endpoint to view one specific product
router.get('/:idProduct', auth, handlePolicies(["ADMIN", "USER", "PUBLIC", "PREMIUM"]), productIdViewsController)

// enpoint to create a product
router.post('/', handlePolicies(["ADMIN"]), createProductController)

// endpoint to update a product
router.put('/:id', handlePolicies(["ADMIN"]), updateProductController)

// endpoint to delete a product
router.delete('/:id', handlePolicies(["ADMIN"]),deleteProductController)

export default router