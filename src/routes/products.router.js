import { Router } from 'express';
import {
    getProductsPaginated,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', getProductsPaginated);
router.get('/:pid', getProductById);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;
