import { Router } from 'express';
import {
    createCart,
    getAllCarts,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantity,
    clearCart,
} from '../controllers/carts.controller.js';

const router = Router();

router.post('/', createCart);
router.get('/', getAllCarts);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/product/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;
