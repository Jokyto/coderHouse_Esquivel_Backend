import { Router } from "express";
import { messageModel } from "../dao/models/messages.models.js";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const messages = await messageModel.find();
    const formattedMessages = messages.map(message => ({
      message: message.message,
      user: message.user === "User"
    }));
    res.render('chat', { messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { user, message } = req.body;
  try {
    const newMessage = await messageModel.create({ user, message });
    const formattedMessage = {
      message: newMessage.message,
      user: newMessage.user === "User"
    };
    res.status(200).json({ status: 'success', payload: formattedMessage });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;


