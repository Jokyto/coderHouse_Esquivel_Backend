import { CartService, ProductService } from "../services/index.js";
import ticketModel from "../dao/models/ticket.models.js";
import {userModel} from "../dao/models/user.model.js";

export const cartViewController = async (req, res) => {
  try {
    const carts = await CartService.getCarts();
    res.status(200).json({ status: "success", payload: carts });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

export const clientCartViewController = async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await CartService.getCartById(id);
    if (!result) {
      return res.status(404).json({ status: "error", error: "Not Found" });
    }

    res.status(200).render("carts", {
      title: result._id,
      products: result.products,
      session: req.session,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const createCartController = async (req, res) => {
  try {
    const result = await CartService.createEmptyCart();
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Problem creating the new cart.", error: err });
  }
};

export const addProductsCartController = async (req, res) => {
  const cartID = req.session.user.cart;
  const productID = req.params.pid;
  const quantity = !req.body ? req.body : { quantity: 1 };
  const existsCart = await CartService.existsCart();
  if (existsCart) {
    try {
      const existProductId = await CartService.existProductInCart(
        cartID,
        productID
      );

      if (existProductId) {
        const existQuantity = existProductId.products.find(
          (item) => item.productID._id.toString() === productID
        );
        const updatedQuantity =
          existQuantity.quantity + parseInt(quantity.quantity);

        await CartService.updateProductInCart(
          cartID,
          productID,
          updatedQuantity
        );

        const updatedProduct = await CartService.updateCartID(cartID);

        res.status(200).json({ status: "success", payload: updatedProduct });
      } else {
        await CartService.pushProductInCart(
          cartID,
          productID,
          quantity.quantity
        );

        const updatedProduct = await CartService.getCartById(cartID);
        res.status(200).json({ status: "success", payload: updatedProduct });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "There was a problem updating.", payload: error });
    }
  } else {
    res.status(500).json({ status: "Cart not found.", error: existsCart });
  }
};

export const updateProductCartController = async (req, res) => {
  const cartID = req.session.user.cart;
  const productID = req.params.pid;
  const quantity = req.body;

  const existsCart = await CartService.existsCart(cartID);
  if (existsCart) {
    try {
      const existProductId = await CartService.existProductInCart(
        cartID,
        productID
      );

      if (existProductId) {
        const existQuantity = existProductId.products.find(
          (item) => item.productID.toString() === productID
        );
        const updatedQuantity =
          existQuantity.quantity + parseInt(quantity.quantity);

        await CartService.updateProductInCart(
          cartID,
          productID,
          updatedQuantity
        );

        const updatedProduct = await CartService.getCartById(cartID);
        res
          .status(200)
          .json({ status: "Updated product.", payload: updatedProduct });
      } else {
        await CartService.pushProductInCart(
          cartID,
          productID,
          quantity.quantity
        );

        const updatedProduct = await CartService.getCartById(cartID);
        res
          .status(200)
          .json({ status: "New product added.", payload: updatedProduct });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "There was a problem updating.", payload: error });
    }
  } else {
    res.status(500).json({ status: "Cart not found.", error: existsCart });
  }
};

export const deleteProductCartController = async (req, res) => {
  const cartID = req.session.user.cart;
  const productID = req.params.pid;

  try {
    // Looking for the cart
    const cart = await CartService.getCartById(cartID);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    // Looking for the product index in the cart
    const productIndex = CartService.findProductIndexInCart(cart, productID);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in the cart" });
    }
    // Deleting the product from the cart
    cart.products.splice(productIndex, 1);

    // Updating the cart
    await CartService.updateCartID(cartID, cart.products);

    res
      .status(200)
      .json({
        status: "success",
        message: `Product with id=${productID} has been removed from the cart`,
      });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

export const deleteCartController = async (req, res) => {
  const cartID = req.params.cid;

  try {
    // Looking for the cart
    const cart = await CartService.getCartById(cartID);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    // Emptying the cart
    await CartService.updateCartID(cartID, []);

    res
      .status(200)
      .json({
        status: "success",
        message: "Cart has been emptied successfully",
      });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

export const purchaseCartController = async (req, res) => {
  const cartID = req.params.cid;
  const user = req.session;

  try {
    const cart = await CartService.getCartById(cartID);

    // Looking for the cart
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    const productsChecked = [];
    const failedToPurchase = [];

    let totalAmount = 0;

    for (const productInCart of cart.products) {
      
      const productID = productInCart.productID.id;
      const quantity = productInCart.quantity;
      

      const product = await ProductService.getProductById(productID);
      
      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      }
      
      if (product[0].stock >= quantity) {
        product[0].stock -= quantity;
        await ProductService.updatePrductQuantity(productID,product[0].stock);
        totalAmount += product[0].price;
        productsChecked.push({
          productId: productInCart.productID._id,
          quantity: quantity,
        });
      } else {
        failedToPurchase.push(productInCart.productID._id);
      }
    }

    if (productsChecked.length > 0) {
      const user = await userModel.findOne({'cart': cartID})
      const ticket = new ticketModel({
        cartId: cartID,
        code: (Math.floor(Math.random() * 9000) + 1000 + new Date().getTime().toString()),
        purchase_datetime: new Date(),
        purchaser: user.first_name,
        amount: totalAmount,
        products: productsChecked,
      });
      
      await ticketModel.create(ticket);
      
      res.status(200).json({ status: "success", payload: ticket });
    } 
    else {
      res
        .status(400)
        .json({
          status: "error",
          message: "Some products couldn't be purchased.",
          failedProducts: failedToPurchase,
        });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
};
