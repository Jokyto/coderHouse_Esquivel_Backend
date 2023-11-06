import { Router } from "express";
import passport from "passport";
import {forgotPasswordEmailSendController,forgotPasswordViewController, githubCallbackController, githubLoginController, loginFailController, loginOutController, loginPassportController, loginViewController, registerFailController, registerPassportController, registerViewController,currentViewController, verifyTokenController, resetPasswordViewController, resetPasswordResetController } from "../controllers/session.controller.js";

const router = Router();

// Register

router.get('/register', registerViewController);
  
router.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/register/fail'}), registerPassportController);
  
router.get('/register/fail', registerFailController)

// Login
router.get('/login', loginViewController)

router.post('/login', passport.authenticate('login',{failureRedirect: '/login/fail'}),loginPassportController);

router.get('/login/out',loginOutController);

router.get('/login/fail',loginFailController)

// GitHub login

router.get('/github', passport.authenticate('github', { scope: ['user: email']}),githubLoginController)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), githubCallbackController)

// Current user
router.get('/current', currentViewController)

// Forgot password
router.get('/forgot', forgotPasswordViewController)

router.post('/forgot', forgotPasswordEmailSendController)

router.get('/verifyToken/:token', verifyTokenController)

// Reset password
router.get('/resetPassword', resetPasswordViewController)

router.post('/resetPassword', resetPasswordResetController)

export default router
