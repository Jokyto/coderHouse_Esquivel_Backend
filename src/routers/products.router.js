import { Router } from "express";
import products from '../data/productos.json' assert {type:'json'}
import productManagement from "../controllers/ProductsManager.js";

const router = Router()

router.get('/', (request,response) => 
{
    const limitsProducts = request.query.limit
    if (!limitsProducts) {
        response.status(200).send(products)
    }
    else
    {
        response.status(200).send(products.slice(0,limitsProducts))
    }
})

router.get('/:idProduct', async(request,response) => 
{
    // const id = request.params.idProduct
    // const product = products.find(Element => Element.id == id)
    // if(!product) return response.send(error)
    // response.send(product)

    // Si uso esto no me funciona no entiendo porque me da undefined de algo que si tengo
    const id = request.params.idProduct
    const product = await productManagement.getProductsById(id)
    response.send(product)

})

router.post('/', async (req,res) => {
    const {title,description,code,price,stock,thumbnail,category,status} = req.body
    const response = await productManagement.addProduct({title,description,price,thumbnail,code,stock})
    if (typeof response == 'string') {
        res.status(500).json({message: `No se pudo registrar el producto porque: ${response}`})
    }
    else{
        const products = await productManagement.getProducts()
        req.io.emit('products', products)
        res.status(200).json({message: 'Producto registrado con éxito!'})
    }

})

router.put('/:id',async (req,res) =>{
    const id = req.params.id
    const data = req.body
    
    const response = await productManagement.updateProduct(parseInt(id),data)
    if (typeof response == 'string') {
        res.status(404).json({message: `No se encontro el producto con id = ${id}`})
    }
    else{
        const products = await productManagement.getProducts()
        req.io.emit('products', products)
        res.status(200).json({message: `Se actualizo el producto con id = ${id}`})    
    }
})

router.delete('/:id',async (req,res) =>{
    const id = req.params.id
    const response = await productManagement.deleteProduct(id)
    if (typeof response == 'string') {
        res.status(404).json({message: `No se encontro el producto con id = ${id}`})   
    }
    else{
        const products = await productManagement.getProducts()
        req.io.emit('products', products)
        res.status(200).json({message: `Se elimino el producto con id = ${id}`})    
    }
})

export default router