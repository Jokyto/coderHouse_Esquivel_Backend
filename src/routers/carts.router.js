import { Router } from "express";
import { cartModel } from "../dao/models/carts.models.js";
// import cartManagment from "../dao/controllers/CartsManager.js"

const router = Router();

//endpoint para leer todos los carritos
router.get('/', async(req,res) => 
{
    try{
        const carts = await cartModel.find()
        res.status(200).json({status: 'success', payload: carts})
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
})

//endpoint para leer del carrito ciertos ID de productos
router.get("/:cid", async (req, res) => {
    const id = req.params.cid;
    // const cart = await cartManagment.getCartsById(id)
    // response.send(cart)

    try {
        const result = await cartModel.find({ id: parseInt(id) });
        res.status(200).json({ status: "success", payload: result });
    } catch (err) {
        res.status(500).json({ status: "error", error: err });
    }
});

//endpoint para crear un carrito vacio nuevo
router.post("/", async (req, res) => {
    // const {products} = req.body
    // await cartManagment.addCart({products})
    // res.json({message: 'Producto registrado con éxito!'})

    try {
        const cartCount = await cartModel.countDocuments();
        const id = (await cartModel.exists({ id: 1 })) ? cartCount + 1 : 1;
      
        try {
          const result = await cartModel.create({ id: parseInt(id), products: [{}] });
          res.status(200).json({ status: "success", payload: result });
        } catch (err) {
          res.status(500).json({ status: "Problem creating the new cart.", error: err });
        }
      } catch (err) {
        res.status(500).json({ status: "Error retrieving cart count.", error: err });
      }
});

//endpoint agregar al carrito productos
router.post("/:cid/product/:pid", async (req, res) => {
    // const cartID = req.params.cid
    // const productID = req.params.pid
    // const quantity = req.body
    // const update = await cartManagment.updateProduct(cartID,productID,quantity)
    // if (!update) {
    //     res.json({message: 'Producto agregado con éxito!'})
    // }
    // else
    // {
    //     res.json({message: `${update}`})
    // }

    const cartID = parseInt(req.params.cid);
    const productID = parseInt(req.params.pid);
    const quantity = req.body;
    
    const existsCart = await cartModel.exists({ id: cartID });
    if (existsCart) {
      try {
        const existProductId = await cartModel.findOne({ 'products.productID': productID });
    
        if (existProductId) {
          const existQuantity = parseInt(existProductId.products.find(item => item.productID === productID).quantity);
          const updatedQuantity = existQuantity + parseInt(quantity.quantity);
    
          await cartModel.findOneAndUpdate(
            { id: cartID, 'products.productID': productID },
            { $set: { 'products.$.quantity': updatedQuantity } }
          );
    
          const updatedProduct = await cartModel.findOne({ id: cartID });
          res.status(200).json({ status: "Updated product.", payload: updatedProduct });
        } else {
          await cartModel.findOneAndUpdate(
            { id: cartID },
            { $push: { products: { productID: productID, quantity: parseInt(quantity.quantity) } } }
          );
    
          const updatedProduct = await cartModel.findOne({ id: cartID });
          res.status(200).json({ status: "New product added.", payload: updatedProduct });
        }
      } catch (error) {
        res.status(500).json({ status: "There was a problem updating.", payload: error });
      }
    } else {
      res.status(500).json({ status: "Cart not found.", error: existsCart });
    }
});

router.delete('/:cid',async (req,res) =>{
    const id = req.params.cid
    try{
        const deleted = await cartModel.deleteOne({id: parseInt(id)})
        res.status(200).json({status: 'success', payload: deleted, message:`Se elimino el carrito con id = ${id}`})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
})

export default router;
