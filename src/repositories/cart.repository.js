export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => await this.dao.getCarts()
    getCartById = async (id) => await this.dao.getCartById(id)
    createEmptyCart = async () => await this.dao.createEmptyCart()
    existsCart = async (id) => await this.dao.existsCart(id)
    existProductInCart = async (cartID, productID) => await this.dao.existProductInCart(cartID, productID)
    updateProductInCart = async (cartID, productID, updatedQuantity) => await this.dao.updateProductInCart(cartID, productID, updatedQuantity)
    updateCartID = async (cartID, products) => await this.dao.updateCartID(cartID, products)
    pushProductInCart = async (cartID, productID, updatedQuantity) => await this.dao.pushProductInCart(cartID, productID, updatedQuantity)
    findProductIndexInCart = async (cart, productID) => await this.dao.findProductIndexInCart(cart, productID);
}