import { cartModel } from "../dao/models/carts.models.js";

export const cartViewController = async(req,res) => 
{
    try{
        const carts = await cartModel.find()
        res.status(200).json({status: 'success', payload: carts})
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
}

export const clientCartViewController = async (req, res) => {
    try {
      const id = req.params.cid;
      const result = await cartModel.findOne({ '_id': id }).populate('products.productID').lean().exec();;
      if (!result) {
        return res.status(404).json({ status: 'error', error: 'Not Found' });
      }
  
      res.status(200).render('carts', {
        title: result._id,
        products: result.products,
        session: req.session
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
}

export const createCartController = async (req, res) => {
    try {
      const result = await cartModel.create({})
      res.status(200).json({status: "success", payload: result})
    } catch (error) {
      res.status(500).json({ status: "Problem creating the new cart.", error: err });
    }
}

export const addProductsCartController = async (req, res) => {
    const cartID = req.session.user.cart;
    const productID = req.params.pid;
    const quantity = !req.body ? req.body : {quantity:1};
    const existsCart = await cartModel.exists({ _id: cartID });
    if (existsCart) {
      try {
        const existProductId = await cartModel.findOne({ _id: cartID,'products.productID': productID }).lean().exec();
    
        if (existProductId) 
        {
          const existQuantity = existProductId.products.find(item => item.productID._id.toString() === productID);
          const updatedQuantity = existQuantity.quantity + parseInt(quantity.quantity);
          
          await cartModel.findOneAndUpdate(
            { _id: cartID, 'products.productID': productID },
            { $set: { 'products.$.quantity': updatedQuantity } }
            );
            
            const updatedProduct = await cartModel.findOne({ _id: cartID });
            res.status(200).json({ status: "success", payload: updatedProduct });
          } 
          else 
          {
          await cartModel.findOneAndUpdate(
            { _id: cartID },
            { $push: { products: { productID: productID, quantity: parseInt(quantity.quantity) } } }
          );
            
          const updatedProduct = await cartModel.findOne({ _id: cartID });
          res.status(200).json({ status: "success", payload: updatedProduct });
        }
      } catch (error) {
        res.status(500).json({ status: "There was a problem updating.", payload: error });
      }
    } else {
      res.status(500).json({ status: "Cart not found.", error: existsCart });
    }
}

export const updateProductCartController = async (req, res) => {
    const cartID = req.session.user.cart;
    const productID = req.params.pid;
    const quantity = req.body;
    
    const existsCart = await cartModel.exists({ _id: cartID });
    if (existsCart) {
      try {
        const existProductId = await cartModel.findOne({ 'products.productID': productID }).lean().exec();
    
        if (existProductId) {
          const existQuantity = existProductId.products.find(item => item.productID.toString() === productID);
          const updatedQuantity = existQuantity.quantity + parseInt(quantity.quantity);
          
          await cartModel.findOneAndUpdate(
            { _id: cartID, 'products.productID': productID },
            { $set: { 'products.$.quantity': updatedQuantity } }
          );
    
          const updatedProduct = await cartModel.findOne({ _id: cartID });
          res.status(200).json({ status: "Updated product.", payload: updatedProduct });
        } else {
          await cartModel.findOneAndUpdate(
            { _id: cartID },
            { $push: { products: { productID: productID, quantity: parseInt(quantity.quantity) } } }
          );
    
          const updatedProduct = await cartModel.findOne({ _id: cartID });
          res.status(200).json({ status: "New product added.", payload: updatedProduct });
        }
      } catch (error) {
        res.status(500).json({ status: "There was a problem updating.", payload: error });
      }
    } else {
      res.status(500).json({ status: "Cart not found.", error: existsCart });
    }
}

export const deleteProductCartController = async (req, res) => {
    const cartID = req.session.user.cart;
    const productID = req.params.pid;
  
    try {
        const cart = await cartModel.findOne({ _id: cartID }).lean().exec();
  
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
  
        const productIndex = cart.products.findIndex(item => item.productID._id.toString() === productID);
  
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Product not found in the cart' });
        }
  
        cart.products.splice(productIndex, 1);
  
        await cartModel.findOneAndUpdate(
            { _id: cartID },
            { $set: { products: cart.products } }
        );
  
        res.status(200).json({ status: 'success', message: `Product with id=${productID} has been removed from the cart` });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err });
    }
}

export const deleteCartController = async (req, res) => {
    const cartID = req.params.cid;
  
    try {
        const cart = await cartModel.findOne({ _id: cartID }).lean().exec();
  
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
  
        await cartModel.findOneAndUpdate(
            { _id: cartID },
            { $set: { products: [] } }
        );
  
        res.status(200).json({ status: 'success', message: 'Cart has been emptied successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err });
    }
}