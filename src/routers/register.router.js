import { Router } from "express"
import session from 'express-session'

const router = Router()

router.get('/', async(req,res)=>{
    res.status(200).render("registro")
})

router.post('/', async (req, res) => {
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      age: req.body.age,
      password: req.body.password,
    };
  
    req.session.user = user;
  
    res.status(200).json({ status: 'success', message: 'Session creada!', data: req.body });
  });

export default router;