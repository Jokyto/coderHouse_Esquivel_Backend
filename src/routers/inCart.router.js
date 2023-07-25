import { Router } from "express";
import { cartModel } from "../dao/models/carts.models.js";

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
      const id = req.params.cid;
      const result = await cartModel.findOne({ '_id': id }).populate('products.productID').lean().exec();;
      if (!result) {
        return res.status(404).json({ status: 'error', error: 'Not Found' });
      }

      res.status(200).render('carts', {
        title: result._id,
        products: result.products
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });


export default router