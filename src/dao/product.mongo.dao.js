import {productModel} from "./models/products.models.js"

export default class ProductDao{
    getAllProducts = async () => await productModel.find()
    getProductById = async (id) => await productModel.find({id: parseInt(id)})
    createProduct = async (product) => await productModel.create(product)
    lastProduct = async () => await productModel.findOne().sort({ id: -1 }).limit(1)
    updateProductById = async (id, data) => await productModel.updateOne({id: parseInt(id)},{$set: data})
    deleteProductById = async (id) => await productModel.deleteOne({id: parseInt(id)})
    updatePrductQuantity = async (productID,stock) => await productModel.findOneAndUpdate({ id: productID },{stock: stock})
}