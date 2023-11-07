import UserDTO from "../dto/user.dto.js";
import { userModel } from "../dao/models/user.model.js";
import { createHash, generateRandomToken, logger } from "../utils.js";
import UserPasswordModel from "../dao/models/user-password.model.js";
import config from "../config/config.js";
import nodemailer from 'nodemailer';

export const nodemailer_user = config.nodemailer_user;
export const nodemailer_pass = config.nodemailer_pass;
export const port = config.defaultPort;


// Authentication
export const auth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect('/api/session/login');
  }
};

// Register

export const registerViewController = async (req, res) => {
    res.status(200).render("./sessions/registro");
}

export const registerPassportController = async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Usuario registrado con exito!'
    });
}

export const registerFailController = (req, res) => {
    res.redirect('/api/session/register')
}

// Login

export const loginViewController = async(req,res)=>{
    res.status(200).render("./sessions/login")
}

export const loginPassportController = async (req, res) => {

    req.session.user = req.user
    res.status(200).json({ status: 'success', message: 'Login successful'})
  
}

export const loginOutController =  (req, res) => {
  
    req.session.destroy(err => 
    {
      if (err) 
      {
        return res.status(500).send('Error occurred');
      } 
      else 
      {
        return res.redirect('/api/session/login');
      }
    });
}

export const loginFailController = (req, res) =>{
    res.send({error: 'Fallo al iniciar sección.'})
} 

// Github Login

export const githubLoginController = async(req,res) =>{
}

export const githubCallbackController = async(req,res) => {
    // console.log('Callback: ',req.user)
    req.session.user = req.user
    // console.log('User session: ', req.session.user)
    res.redirect('/products')
}

//Current view

export const currentViewController = (req, res) =>{
  const user = new UserDTO(req.session.user)
  res.status(200).render('./sessions/current', {
    title: "Current User",
    user: user,
    session: req.session
  })
}

// Forgot Password

export const forgotPasswordViewController = async(req, res) => {
  res.status(200).render("./sessions/forgot");
}

export const forgotPasswordEmailSendController = async(req, res) => {
  const email = req.body.email
  const user = await userModel.find({ email: email})
  
  if(!user){
    return res.status(404).json({ status: 'error', error: 'User not found' })
  }

  const token = generateRandomToken(16);
  await UserPasswordModel.create({email: email, token: token})
  const mailerConfig = {
    service: 'gmail',
    auth: { user: nodemailer_user, pass: nodemailer_pass}
  }

  let transporter = nodemailer.createTransport(mailerConfig);
  let message = {
    from: nodemailer_user,
    to: email,
    subject: '[Eccomerce-coderHouse-project] Reset Password',
    html: `<h1>Reset Password</h1><hr /> You have requested to reset your password. You can do so by clicking in the next link:
    <a href="http://${req.hostname}:${port}/api/session/verifyToken/${token}">http://${req.hostname}:${port}/api/session/verifyToken/${token}</a> `
  }

  try {
    await transporter.sendMail(message)
    res.status(200).json({ status: 'success'})
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message })
  }
}

export const verifyTokenController = async (req, res) =>{
  const userPassword = await UserPasswordModel.findOne({ token: req.params.token })
  
  if(!userPassword)
  {
    return res.status(404).render('./sessions/forgot' ,{
      status: 'error',
      message: "Your token has expired. Please try again!",
    })
  }

  const user = userPassword.email
  res.render('./sessions/resetPassword', {user})
}

// Reset Password

export const resetPasswordViewController = async (req, res) => {
  const userPassword = await UserPasswordModel.findOne({ token: req.params.token})
  if(!userPassword)
  {
    return res.status(404).json({ status: 'error', error: 'Token no '})
  }
}

export const resetPasswordResetController = async (req, res) => {
  try {
    console.log(req)
    const user = await userModel.findOne({ email: req.body.email})
    await userModel.findByIdAndUpdate(user._id, { password: createHash(req.body.password) })
    res.json({ status: 'success', message: 'Your password has been changed.' })
    await UserPasswordModel.deleteOne({ email: req.body.email})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', error: error.message })
  }
}