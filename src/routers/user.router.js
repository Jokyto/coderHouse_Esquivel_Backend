import { Router } from "express";
import { userPremiumChangeController, userPremiumViewController } from "../controllers/user.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

// GET users
router.get('/',handlePolicies(["ADMIN"]), userPremiumViewController);

// GET para cambiar de roll de premium a user
router.get('/premium/:uid', userPremiumChangeController);

// POST para mandar los documentos
router.post('/:uid/documents', )

export default router