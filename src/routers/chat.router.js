import { Router } from "express";
import { messageModel } from "../dao/models/messages.models.js";

const router = Router();

const auth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};


router.get('/', auth,async (req, res) => {
  try {
    const messages = await messageModel.find();
    const formattedMessages = messages.map(message => ({
      _id: message._id, // Include the _id field
      message: message.message,
      user: message.user
    }));
    res.render('chat', { 
      tittle: 'Chat',
      messages: formattedMessages,
      session: req.session 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { user, message } = req.body;
  try {
    const newMessage = await messageModel.create({ user, message });
    const formattedMessage = {
      _id: newMessage._id,
      message: newMessage.message,
      user: newMessage.user
    };
    req.app.get("socketio").emit("message", formattedMessage); // Emit the message to all connected clients
    res.status(200).json({ status: 'success', payload: formattedMessage });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;



