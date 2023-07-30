import { Router, json } from "express"
import { userModel } from "../dao/models/user.model.js"


const router = Router()

router.get('/', async(req,res)=>{
    res.status(200).render("login")
})

router.post('/', async (req, res) => {
  const sessionData = req.session;

  try {
    const user = sessionData.user;
    console.log(typeof(user.email))
    
    const userInDb = await userModel.findOne({ email: user.email });
    
    if (userInDb && userInDb.password === user.password) {

      res.status(200).json({ status: 'success', message: 'Login successful' });
      
    } 
    else {
      res.status(404).json({ status: 'error', message: 'User not found or incorrect credentials' });
      
    }
  } catch (err) {
    
    res.status(500).json({ status: 'error', message: 'Error occurred', error: err });
  }
});

export default router;