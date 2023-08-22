import { Router } from "express";
import { auth } from "../controllers/session.controller.js";
import { addChatController, chatViewController } from "../controllers/chat.controller.js";

const router = Router();

// endpoint to view all the messages in the chat
router.get('/', auth,chatViewController);

// endpoint to add a message in the chat
router.post('/', addChatController);

export default router;



