import { productModel } from "../dao/models/products.models.js";

function formatProducts(products) {
    return products.map(product => {
      return {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
      };
    });
  }

export const getAllProducts = async (req, res) => {
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    let sort = parseInt(req.query.sort) == 1 ? 1 : (parseInt(req.query.sort) == -1 ? -1 : 0)
  
    try {
      const products = await productModel.paginate({}, { page, limit, lean: true, sort: {price: sort} })
      products.prevLink = products.hasPrevPage ? (sort != 0 ? `/products?page=${products.prevPage}&?limit=${limit}&sort=${sort}` : `/products?page=${products.prevPage}&?limit=${limit}`)  : ''
      products.nextLink = products.hasNextPage ? (sort != 0 ? `/products?page=${products.nextPage}&?limit=${limit}&sort=${sort}` : `/products?page=${products.nextPage}&?limit=${limit}`)  : ''
      
      res.status(200).render('home', {
        title: "Products",
        products: products,
        session: req.session,
        user: req.session.user.email
      });
    } catch (error) {
      res.status(404).json({ status: 'error', error: error });
    }
}

export const productsInRealTime = async (req, res) => {
    try {
      const products = await productModel.find()
      const formattedProducts = formatProducts(products);
  
      res.render('RealTimeProducts', {
        title: 'Real Time Products',
        products: formattedProducts,
        session: req.session
      });
    } catch (error) {
      res.status(404).json({ status: 'error', error: error });
    }
}