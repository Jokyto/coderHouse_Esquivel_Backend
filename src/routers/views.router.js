import { Router } from "express";
import productManagement from "../controllers/ProductsManager.js";

const router = Router()

router.get("/", async (req, res) => {
    const products = await productManagement.getProducts()
    res.render('home', {
      title: "Products",
      products: products})
  })


export default router