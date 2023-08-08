import passport from "passport";
import local from "passport-local"
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../app.js";


const LocalStrategy = local.Strategy

const intializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },async(req, username, password, done) => {
        const first_name = req.body.first_name
        const last_name = req.body.last_name
        const email = req.body.email
        const age = req.body.age
        try{
            const user = await userModel.findOne({email: username})
            if (user) {
                console.log('El usuario ya existe.')
                return done(null, false)
            }

            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        }
        catch(err)
        {
            return done('Error al obtener usuario.')
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