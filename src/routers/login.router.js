import { Router} from "express"
import { userModel } from "../dao/models/user.model.js"

const router = Router()

router.get('/', async(req,res)=>{
    res.status(200).render("login")
})

router.post('/', async (req, res) => {
  const user = req.body;

  try {

    const userInDb = await userModel.findOne({ email: user.email });
    
    if (userInDb && userInDb.password === user.password) {
      req.session.user = {
        first_name: userInDb.first_name,
        rol: userInDb.rol
      }

      res.status(200).json({ status: 'success', message: 'Login successful'});
      
    } 
    else {
      res.status(404).json({ status: 'error', message: 'El usuario y/o contraseña son incorrectos.' });
      
    }
  } 
  catch (err) {
    
    res.status(500).json({ status: 'error', message: 'Error occurred', error: err });
  }
});

router.get('/out', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error occurred');
    } else {
      return res.redirect('/login');
    }
  });
});

export default router;