import mongoose from "mongoose"

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    id: {type: Number, require: true},
    products: [
        {
            productID: {type: Number, require: true},
            quantity: {type: Number, require: true}
        }
    ]
})

export const cartModel = mongoose.model(cartCollection, cartSchema)