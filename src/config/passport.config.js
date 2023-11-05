import passport from "passport";
import local from "passport-local"
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/createHash.js";
import GitHubStrategy from 'passport-github2'
import { cartModel } from "../dao/models/carts.models.js";
import config from "./config.js";
import logger from "../utils/logger.js";


const LocalStrategy = local.Strategy

const intializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },async(req, username, password, done) => {
        const adminEmail =  config.adminEmail
        const adminPassword = config.adminPassword
        const adminRoll = config.adminRoll
        const first_name = req.body.first_name
        const last_name = req.body.last_name
        const email = req.body.email
        const age = req.body.age
        try{
            const user = await userModel.findOne({email: username})
            if (user) {
                logger.error('El usuario ya existe.')
                return done(null, false)
            }
            const cartForUser = await cartModel.create({})
            if (email === adminEmail && password === adminPassword) {
                const rol = adminRoll
                const newUser = {
                    first_name, last_name, email, age, password: createHash(password), cart: cartForUser._id,rol
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            }
            else{
                const newUser = {
                    first_name, last_name, email, age, password: createHash(password), cart: cartForUser._id
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            } 
        }
        catch(err)
        {
            return done(err)
        }    
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    },async(username, password, done) =>{
        try
        {
            const user = await userModel.findOne({email: username})
            if (!user) 
            {
                return done(null, false)    
            }
            if (!isValidPassword(user, password))
            {
                return done(null, false) 
            }
            return done(null, user)
        }
        catch(err)
        {
            return done('Error al iniciar usuario.')
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackUrl: config.callbackUrl
    }, async(accessToken, refreshToken, profile, done) => {
        try
        {
            const user = await userModel.findOne({email: profile._json.email})
            if (user) 
            {
                return done(null,user)    
            }
            const cartForUser = await cartModel.create({})
            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                cart: cartForUser._id
            })
            return done(null, newUser)
        }
        catch(err)
        {
            return done('Error to login with GitHub!')
        }
    }))

    passport.serializeUser((user, done) =>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id,done)=>{
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default intializePassport