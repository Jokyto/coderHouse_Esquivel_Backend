import { Router } from "express"
import {generateProduct} from "../services/mocksService.js"

const router = Router();
const products = []

router.get('/', async (req, res) => {
    for (let i = 0; i < products.length; i++) {
        products.push(generateProduct());
    }
    res.status(200).render('home', {
        title: "Products",
        products: products,
        session: req.session
      });
})

export default router;