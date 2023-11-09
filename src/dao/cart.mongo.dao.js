import {cartModel} from "./models/carts.models.js"

export default class CartDAO {
    getCarts = async () => await cartModel.find();
    getCartById = async (id) => {
        const cart = await cartModel.findOne({ '_id': id }).populate('products.productID').lean().exec();
        return cart;
    };
    createEmptyCart = async () => await cartModel.create({})
    existsCart = async (id) => await cartModel.exists({ _id: id })
    existProductInCart = async (cartID, productID) => await cartModel.findOne({ _id: cartID,'products.productID': productID }).lean().exec();
    updateProductInCart = async (cartID, productID, updatedQuantity) => await cartModel.findOneAndUpdate(
        { _id: cartID, 'products.productID': productID },
        { $set: { 'products.$.quantity': updatedQuantity } }
        )
    updateCartID = async (cartID, products) => await cartModel.findOneAndUpdate({ _id: cartID },{ $set: { products: products }});
    pushProductInCart = async (cartID, productID,quantity) => await cartModel.findOneAndUpdate(
        { _id: cartID },
        { $push: { products: { productID: productID, quantity: parseInt(quantity) } } }
      );
    findProductIndexInCart = async (cart,productID) => await cart.products.findIndex(item => item.productID._id.toString() === productID);
}