import { Router } from "express";
import { logsController } from "../controllers/log.controller.js";

const router = Router()

router.get('/', logsController)

export default router