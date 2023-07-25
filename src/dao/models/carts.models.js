import mongoose from "mongoose"

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        default: []
    }
})


//middleware del mongoose con populate
cartSchema.pre('findOne',function(){
    this.populate('products.productID')
})
mongoose.set('strictQuery', false)
export const cartModel = mongoose.model(cartCollection, cartSchema)