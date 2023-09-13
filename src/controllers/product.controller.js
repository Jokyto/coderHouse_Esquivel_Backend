import {ProductService} from "../services/index.js"

export const productViewsController = async(req,res) => 
{
    try{
        // Getting all the products
        const products = await ProductService.getAllProducts()
        res.status(200).json({status: 'success', payload: products})
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
}

export const productIdViewsController = async(req,res) => 
{
    const id = req.params.idProduct
    try{
        // Getting a Product by the ID
        const result = await ProductService.getProductById(id)
        res.status(200).json({status: 'success', payload: result})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
}

export const createProductController = async (req, res) => {
    const product = req.body;
    try {
        const lastProduct = await ProductService.lastProduct();
        const lastProductId = lastProduct ? lastProduct.id : 0;
        const newProductId = lastProductId + 1;
        
        //   Creating a product and then putting it into the DB
        const newProduct = { ...product, id: newProductId };
        const result = await ProductService.createProduct(newProduct);
        
        //   Getting all the products from the DB
        const products = await ProductService.getAllProducts()
        
        //   Emitting to the IO socket
        req.io.emit('products', products);
        
        res.status(200).json({
            status: 'success',
            payload: result,
            message: 'Producto registrado con éxito!'
        });
    } 
    catch (err) {
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
        // Updating a product from the DB with the given ID
        const updated = await ProductService.updateProductById(id,data)
        
        // Getting all the products
        const products = await ProductService.getAllProducts()
        
        //   Emitting to the IO socket
        req.io.emit('products', products)
        res.status(200).json({status: 'success', payload: updated,message: `Se actualizo el producto con id = ${id}`})   
    }catch(err){
        res.status(404).json({status:'error',error: err,message: `No se encontro el producto con id = ${id}`})
    }
}

export const deleteProductController = async (req,res) =>{
    const id = req.params.id
    try{
        // Deleting a Product from the DB with the given ID
        const deleted = await ProductService.deleteProductById(id)

        // Getting all the products from the DB
        const products = await ProductService.getAllProducts()

        //   Emitting to the IO socket
        req.io.emit('products', products)
        res.status(200).json({status: 'success', payload: deleted, message:`Se elimino el producto con id = ${id}`})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
}