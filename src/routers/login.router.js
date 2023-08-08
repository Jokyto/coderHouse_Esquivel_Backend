import { Router} from "express"
import { userModel } from "../dao/models/user.model.js"
import { isValidPassword } from "../app.js"
import passport from "passport"

const router = Router()

router.get('/', async(req,res)=>{
    res.status(200).render("login")
})

router.post('/', passport.authenticate('login',{failureRedirect: '/login/fail'}),async (req, res) => {
  // const user = req.body;

  // try
  // {

  //   const userInDb = await userModel.findOne({ email: user.email });
  //   if (!userInDb) {
  //     return res.status(401).json({ status: 'error', message: 'El usuario no existe.' })
  //   }
  //   if (!isValidPassword(userInDb, user.password)) {
  //     return res.status(403).json({ status: 'error', message: 'Contraseña incorrecta.' })
  //   }

  //   req.session.user = 
  //   {
  //     first_name: userInDb.first_name,
  //     rol: userInDb.rol
  //   }
  //   res.status(200).json({ status: 'success', message: 'Login successful'})

  // } 
  // catch (err) 
  // {
    
  //   res.status(500).json({ status: 'error', message: 'Error occurred', error: err });
  // }

  res.status(200).json({ status: 'success', message: 'Login successful'})
});

router.get('/out', (req, res) => {
  
  req.session.destroy(err => 
  {
    if (err) 
    {
      return res.status(500).send('Error occurred');
    } 
    else 
    {
      return res.redirect('/login');
    }
  });
});

router.get('/fail',(req, res) =>{
  res.send({error: 'Fallo al iniciar sección.'})
})

export default router;