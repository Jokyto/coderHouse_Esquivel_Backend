import { Router } from "express";
import { auth } from "../controllers/session.controller.js";
import { addProductsCartController, cartViewController, clientCartViewController, createCartController, deleteCartController, deleteProductCartController, updateProductCartController } from "../controllers/cart.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

//endpoint para leer todos los carritos
router.get('/', auth, cartViewController)

//endpoint para leer del carrito ciertos ID de productos
// router.get("/:cid",auth, async (req, res) => {
//   const id = req.params.cid;

//   try {
//     const result = await cartModel.findOne({ _id: id }).populate('products.productID').lean().exec();

//     if (!result) {
//       return res.status(404).json({ status: "error", message: "Cart not found" });
//     }

//     res.status(200).json({ status: "success", payload: result });
//   } catch (err) {
//     res.status(500).json({ status: "error", error: err });
//   }
// });

// endpoint para leer el carrito de un cliente
router.get('/:cid', handlePolicies(["ADMIN", "USER"]), auth,clientCartViewController);

//endpoint para crear un carrito vacio nuevo
router.post("/", createCartController);

//endpoint agregar al carrito productos
router.post("/:cid/product/:pid", handlePolicies(["ADMIN", "USER"]), addProductsCartController);

//endpoint actualiza solo la cantidad pasada por req.body
router.put("/:cid/product/:pid", updateProductCartController);

//endpoint elimina del carrito un producto
router.delete('/:cid/product/:pid', deleteProductCartController);

//endpoint elimina todo el carrito
router.delete('/:cid', deleteCartController);

export default router;
