import { Router } from "express"
import session from 'express-session'

const router = Router()

router.get('/', async(req,res)=>{
    res.status(200).render("login")
})

router.post('/', async(req,res)=>{
    res.send(req.session.user.first_name)
})

router.get('/out', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error occurred');
      } else {
        return res.status(200).json({ status: 'success', message: 'Logout successful' });
      }
    });
});
  

export default router;