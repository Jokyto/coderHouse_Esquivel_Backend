import { Router } from "express";
import { userPremiumChangeController } from "../controllers/user.controller.js";

const router = Router();

router.get('/premium/:uid', userPremiumChangeController);
// router.post('/:uid/documents', )

export default router