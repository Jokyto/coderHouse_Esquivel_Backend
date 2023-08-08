import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
// import { createHash } from "../app.js";
import passport from "passport";

const router = Router();

router.get('/', async (req, res) => {
  res.status(200).render("registro");
});

router.post('/', passport.authenticate('register', {
  failureRedirect: '/register/fail'
}), async (req, res) => {
  // const admin_user = process.env.ADMIN_EMAIL;
  // const admin_password = process.env.ADMIN_PASSWORD;
  // const admin_rol = process.env.ADMIN_ROLL;
  
  // const user = {
  //   first_name: req.body.first_name,
  //   last_name: req.body.last_name,
  //   email: req.body.email,
  //   age: req.body.age,
  //   password: createHash(req.body.password),
  //   rol: 'User'
  // };
  
  // try {
  //   const userInDb = await userModel.findOne({ email: user.email });
    
  //   if (userInDb) 
  //   {
  //     res.status(500).json({ status: 'error', message: 'El usuario ya esta en la base de datos.' });
  //   } 
  //   else 
  //   {
  //     if ((user.email === admin_user && user.password === admin_password && user.rol != admin_rol)) 
  //     {
  //       user.rol = admin_rol;
  //       console.log(user.rol)
  //     }

  //     const createUser = await userModel.create(user);

  //     res.status(200).json({
  //       status: 'success',
  //       payload: createUser,
  //       message: 'Usuario registrado con exito!'
  //     });
  //   }
  // } catch (err) {
  //   console.log(err)
  //   res.status(500).json({ status: 'error', message: 'Error occurred', error: err });
  // }
  res.status(200).json({
    status: 'success',
    message: 'Usuario registrado con exito!'
  });
});

router.get('/fail', (req, res) => {
  res.redirect('/register')
})


export default router;
