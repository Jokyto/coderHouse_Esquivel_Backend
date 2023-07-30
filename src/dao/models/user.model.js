import mongoose from "mongoose"

const userCollection = 'sessions'

const userSchema = new mongoose.Schema(
    {
        first_name: {type: String},
        last_name: {type: String},
        email: {type: String},
        age: {type: Number},
        password: {type: String},
        rol: {type: String, default: "User"}
    }
)

mongoose.set('strictQuery', false)
export const userModel = mongoose.model(userCollection, userSchema)



