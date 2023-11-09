import mongoose from "mongoose"

const userCollection = 'users'

const userSchema = new mongoose.Schema(
    {
        first_name: {type: String},
        last_name: {type: String},
        email: {type: String},
        age: {type: Number},
        password: {type: String},
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        rol: {type: String, default: "USER"},
        documents: [
            {
                name: { type: String },
                reference : { type: String }
            }
        ],
        last_connection: { type: Date, default: Date.now },
    }
)

mongoose.set('strictQuery', false)
export const userModel = mongoose.model(userCollection, userSchema)



