import { Router } from "express";
import cartManagment from "../dao/controllers/CartsManager.js"


const router = Router()

//endpoint para crear un carrito vacio nuevo
router.post('/', async (req,res) => {
    const {products} = req.body
    await cartManagment.addCart({products})
    res.json({message: 'Producto registrado con éxito!'})
})

//endpoint para leer del carrito ciertos ID de productos
router.get('/:cid', async(request,response) => 
{
    const id = request.params.cid
    const cart = await cartManagment.getCartsById(id)
    response.send(cart)

})

//endpoint agregar al carrito productos
router.post('/:cid/product/:pid', async (req,res) => {
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity = req.body
    const update = await cartManagment.updateProduct(cartID,productID,quantity)
    if (!update) {
        res.json({message: 'Producto agregado con éxito!'})
    }
    else
    {
        res.json({message: `${update}`})
    }
})


export default router