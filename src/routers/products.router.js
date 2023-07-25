import { Router } from "express"
import { productModel } from "../dao/models/products.models.js"
// import products from '../data/productos.json' assert {type:'json'}
// import productManagement from "../dao/controllers/ProductsManager.js"


const router = Router()

router.get('/', async(req,res) => 
{
    try{
        const products = await productModel.find()
        res.status(200).json({status: 'success', payload: products})
    }catch(err){
        res.status(500).json({status:'error',error: err})
    }
    
    // const limitsProducts = request.query.limit
    // if (!limitsProducts) {
    //     response.status(200).send(products)
    // }
    // else
    // {
    //     response.status(200).send(products.slice(0,limitsProducts))
    // }
})

router.get('/:idProduct', async(req,res) => 
{
    // const id = request.params.idProduct
    // const product = products.find(Element => Element.id == id)
    // if(!product) return response.send(error)
    // response.send(product)

    // Si uso esto no me funciona no entiendo porque me da undefined de algo que si tengo
    // const id = request.params.idProduct
    // const product = await productManagement.getProductsById(id)
    // response.send(product)

    const id = req.params.idProduct
    try{
        const result = await productModel.find({id: parseInt(id)})
        res.status(200).json({status: 'success', payload: result})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
})

router.post('/', async (req, res) => {
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

    // const {title,description,code,price,stock,thumbnail,category,status} = req.body
    // const response = await productManagement.addProduct({title,description,price,thumbnail,code,stock})
    // if (typeof response == 'string') {
    //     res.status(500).json({message: `No se pudo registrar el producto porque: ${response}`})
    // }
    // else{
    //     const products = await productManagement.getProducts()
    //     req.io.emit('products', products)
    //     res.status(200).json({message: 'Producto registrado con éxito!'})
    // }

})

router.put('/:id',async (req,res) =>{
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
    // const response = await productManagement.updateProduct(parseInt(id),data)
    // if (typeof response == 'string') {
    //     res.status(404).json({message: `No se encontro el producto con id = ${id}`})
    // }
    // else{
    //     const products = await productManagement.getProducts()
    //     req.io.emit('products', products)
    //     res.status(200).json({message: `Se actualizo el producto con id = ${id}`})    
    // }
})

router.delete('/:id',async (req,res) =>{
    const id = req.params.id
    try{
        const deleted = await productModel.deleteOne({id: parseInt(id)})
        const products = await productModel.find()
        req.io.emit('products', products)
        res.status(200).json({status: 'success', payload: deleted, message:`Se elimino el producto con id = ${id}`})
    }catch(err){
        res.status(500).json({status: 'error', error: err})
    }
    // const response = await productManagement.deleteProduct(id)
    // if (typeof response == 'string') {
    //     res.status(404).json({message: `No se encontro el producto con id = ${id}`})   
    // }
    // else{
    //     const products = await productManagement.getProducts()
    //     req.io.emit('products', products)
    //     res.status(200).json({message: `Se elimino el producto con id = ${id}`})    
    // }
})

export default router