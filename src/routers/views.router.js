import { Router } from "express";
import { auth } from "../controllers/session.controller.js";
import { getAllProducts, productsInRealTime } from "../controllers/views.controller.js";

const router = Router();

// endpoint to view all the products
router.get("/", auth, getAllProducts);

// enpoint to view all the products in real time
router.get("/realtimeproducts", auth, productsInRealTime);

export default router;