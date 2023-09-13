import { Router } from "express";
import passport from "passport";
import { githubCallbackController, githubLoginController, loginFailController, loginOutController, loginPassportController, loginViewController, registerFailController, registerPassportController, registerViewController,currentViewController } from "../controllers/session.controller.js";

const router = Router();

// Register

router.get('/register', registerViewController);
  
router.post('/register', passport.authenticate('register', {failureRedirect: 'api/session/register/fail'}), registerPassportController);
  
router.get('/fail', registerFailController)

// Login
router.get('/login', loginViewController)

router.post('/login', passport.authenticate('login',{failureRedirect: '/login/fail'}),loginPassportController);

router.get('/login/out',loginOutController);

router.get('/login/fail',loginFailController)

// GitHub login

router.get('/github', passport.authenticate('github', { scope: ['user: email']}),githubLoginController)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), githubCallbackController)

//Current user
router.get('/current', currentViewController)

export default router
