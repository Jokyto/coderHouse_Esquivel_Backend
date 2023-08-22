import { productModel } from "../dao/models/products.models.js"

export const productViewsController = async(req,res) => 
{
    try{
        const products = await productModel.find()
        res.status(200).json({status: 'success', payload: products})
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
}

export const productIdViewsController = async(req,res) => 
{
    const id = req.params.idProduct
    try{
        const result = await productModel.find({id: parseInt(id)})
        res.status(200).json({status: 'success', payload: result})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
}

export const createProductController = async (req, res) => {
    const product = req.body;
    try {
      const lastProduct = await productModel.findOne().sort({ id: -1 }).limit(1);
      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;
  
      const newProduct = { ...product, id: newProductId };
      const result = await productModel.create(newProduct);
      
      const products = await productModel.find();
      
      req.io.emit('products', products);
      
      res.status(200).json({
        status: 'success',
        payload: result,
        message: 'Producto registrado con éxito!'
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: err,
        message: 'No se pudo registrar el producto.'
      });
    }
}

export const updateProductController = async (req,res) =>{
    const id = req.params.id
    const data = req.body
    try{
        const updated = await productModel.updateOne({id: parseInt(id)},{$set: data})
        const products = await productModel.find()
        req.io.emit('products', products)
        res.status(200).json({status: 'success', payload: updated,message: `Se actualizo el producto con id = ${id}`})   
    }catch(err){
        res.status(404).json({status:'error',error: err,message: `No se encontro el producto con id = ${id}`})
    }
}

export const deleteProductController = async (req,res) =>{
    const id = req.params.id
    try{
        const deleted = await productModel.deleteOne({id: parseInt(id)})
        const products = await productModel.find()
        req.io.emit('products', products)
        res.status(200).json({status: 'success', payload: deleted, message:`Se elimino el producto con id = ${id}`})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
}