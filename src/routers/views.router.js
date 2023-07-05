import { Router } from "express";
import productManagement from "../dao/controllers/ProductsManager.js";

const router = Router()

router.get("/", async (req, res) => {
    const products = await productManagement.getProducts()
    res.render('home', {
      title: "Products",
      products: products
    })
  })


router.get("/realtimeproducts", async(req,res) => {
  const product = await productManagement.getProducts()
  res.render('RealTimeProducts', {
    title: 'Real Time Products',
    products: product
  })
})



export default router