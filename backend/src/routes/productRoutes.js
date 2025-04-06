import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createProduct,
  getProducts,
  getProductDetails,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductDetails);

router.use(protect); // Protect all routes after this middleware
router.use(restrictTo('admin')); // Restrict to admin only

router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

export default router;