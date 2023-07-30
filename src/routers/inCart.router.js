import { Router } from "express";
import { cartModel } from "../dao/models/carts.models.js";

const router = Router();

const auth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};


router.get('/:cid', auth,async (req, res) => {
    try {
      const id = req.params.cid;
      const result = await cartModel.findOne({ '_id': id }).populate('products.productID').lean().exec();;
      if (!result) {
        return res.status(404).json({ status: 'error', error: 'Not Found' });
      }

      res.status(200).render('carts', {
        title: result._id,
        products: result.products,
        session: req.session
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });


export default router