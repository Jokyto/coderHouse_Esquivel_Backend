import { Router } from "express";
import { auth } from "../controllers/session.controller.js";
import { getAllProducts, productsInRealTime } from "../controllers/views.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

// endpoint to view all the products
router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), auth, getAllProducts);

// enpoint to view all the products in real time
router.get("/realtimeproducts", handlePolicies(["ADMIN", "USER", "PUBLIC"]), auth, productsInRealTime);

export default router;