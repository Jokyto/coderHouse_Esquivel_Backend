import { Router } from "express";
import { productModel } from "../dao/models/products.models.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    const formattedProducts = formatProducts(products);

    res.status(200).render('home', {
      title: "Products",
      products: formattedProducts
    });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find();
    const formattedProducts = formatProducts(products);

    res.render('RealTimeProducts', {
      title: 'Real Time Products',
      products: formattedProducts
    });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
});

function formatProducts(products) {
  return products.map(product => {
    return {
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnail: product.thumbnail,
    };
  });
}

export default router;