import mongoose from "mongoose"

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    id: {type: Number},
    title: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    code: {type: String,unique: true, require: true},
    status: {type: Boolean, default: true},
    stock: {type: Number, require: true},
    category: {type: String, require: true},
    thumbnail: {type: [String], default: []}
})

mongoose.set('strictQuery', false)
export const productModel = mongoose.model(productCollection, productSchema)