export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAllProducts = async () => await this.dao.getAllProducts()
    getProductById = async (id) => await this.dao.getProductById(id)
    getProductBy_Id = async (id) => await this.dao.getProductBy_Id(id)
    createProduct = async (product) => await this.dao.createProduct(product)
    lastProduct = async () => await this.dao.lastProduct()
    updateProductById = async (id, data) => await this.dao.update({id: id, data: data})
    deleteProductById = async (id) => await this.dao.deleteProductById(id)
    deleteProductBy_Id = async (id) => await this.dao.deleteProductBy_Id(id)
    updatePrductQuantity = async (productID, quantity) => await this.dao.updatePrductQuantity(productID, quantity)
}