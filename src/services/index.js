// DAO with models
import ProductDAO  from '../dao/product.mongo.dao.js'
import CartDAO from '../dao/cart.mongo.dao.js'
import UserDAO from '../dao/user.mongo.dao.js'

// Middleware between dao and services
import ProductRepository from '../repositories/product.repository.js'
import CartRepository from '../repositories/cart.repository.js'
import UserRepository from '../repositories/user.repository.js'

// Services
export const ProductService = new ProductRepository(new ProductDAO())
export const CartService = new CartRepository(new CartDAO())
export const UserService = new UserRepository(new UserDAO())