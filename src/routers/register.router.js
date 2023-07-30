import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import mongoose from "mongoose";

const router = Router();

router.get('/', async (req, res) => {
  res.status(200).render("registro");
});

router.post('/', async (req, res) => {
  const admin_user = process.env.ADMIN_EMAIL;
  const admin_password = process.env.ADMIN_PASSWORD;
  const userSessionId = req.session.id;

  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    roll: 'User'
  };

  if (user.email === admin_user || user.password === admin_password) {
    user.roll = process.env.ADMIN_ROLL;
  }

  try {
    const sessionObjectId = new mongoose.Types.ObjectId(userSessionId);
    console.log(typeof (sessionObjectId));
    const sessionInDb = await userModel.findOne({ _id: sessionObjectId });

    if (sessionInDb) {
      sessionInDb.user = user;
      await sessionInDb.save();
      res.status(200).json({ status: 'success', message: 'User added to the session successfully', data: req.body });
    } else {
      res.status(404).json({ status: 'error', message: 'Session not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: 'Error occurred', error: err });
  }
});

export default router;
