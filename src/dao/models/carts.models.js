import mongoose from "mongoose"

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: {type: Number, require: true},
    products: [
        {
            productID: {type: Number, require: true},
            quantity: {type: Number, require: true}
        }
    ]
})

mongoose.set('strictQuery', false)
export const cartModel = mongoose.model(cartCollection, cartSchema)