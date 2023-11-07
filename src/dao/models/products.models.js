import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import config from "../../config/config.js"

const adminEmail = config.adminEmail;

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
    thumbnail: {type: [String], default: []},
    owner: {
        type: String,
        ref: 'users',
        default: adminEmail,
    },
})

productSchema.plugin(mongoosePaginate)

mongoose.set('strictQuery', false)
export const productModel = mongoose.model(productCollection, productSchema)