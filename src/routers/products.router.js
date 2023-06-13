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
    productManagement.addProduct({title,description,price,thumbnail,code,stock})
    await res.json({message: 'Producto registrado con éxito!'})
})

router.put('/:id',async (req,res) =>{
    const id = req.params.id
    console.log(`${id}`)
    const data = req.body
    
    // Queria usar esto y no me funciona T-T
    await productManagement.updateProduct(parseInt(id),data)
    res.json({message: `Se actualizo el producto con id = ${id}`})    
})

router.delete('/:id',async (req,res) =>{
    const id = req.params.id
    await productManagement.deleteProduct(id)
    res.json({message: `Se elimino el producto con id = ${id}`})    
})

export default router