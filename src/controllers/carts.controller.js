import Cart from '../models/carts.model.js';
import mongoose from 'mongoose';
import Product from '../models/products.model.js';

// Endpoint para crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();

        res.status(201).json({
            id: savedCart._id.toString(), // ✅ ID como String
            products: savedCart.products,
        });
    } catch (error) {
        console.error('[CART][CREATE]', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

// Endpoint para obtener todos los carritos
export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.status(200).json(carts);
    } catch (error) {
        console.error('[CART][GET_ALL]', error);
        res.status(500).json({ error: 'Error al listar los carritos' });
    }
};

// Endpoint para obtener un carrito por ID
export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ error: 'ID de carrito inválido' });
        }

        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json({ products: cart.products });
    } catch (error) {
        console.error('[CART][GET]', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

// Endpoint para agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(cid) ||
            !mongoose.Types.ObjectId.isValid(pid)
        ) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cart = await Cart.findById(cid);
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        const productExists = await Product.findById(pid);
        if (!productExists)
            return res.status(404).json({ error: 'Producto no existe' });

        const existingItem = cart.products.find(
            (p) => p.product.toString() === pid
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        const updatedCart = await cart.save();
        res.status(200).json({ products: updatedCart.products });
    } catch (error) {
        console.error('[CART][ADD_PRODUCT]', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

// Endpoint para eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
        );

        const updatedCart = await cart.save();
        res.status(200).json({ products: updatedCart.products });
    } catch (error) {
        console.error('[CART][REMOVE_PRODUCT]', error);
        res.status(500).json({
            error: 'Error al eliminar producto del carrito',
        });
    }
};

// Endpoint para actualizar todos los productos del carrito
export const updateCartProducts = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                error: 'El cuerpo debe contener un arreglo de productos',
            });
        }

        const cart = await Cart.findById(cid);
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;
        const updatedCart = await cart.save();

        res.status(200).json({ products: updatedCart.products });
    } catch (error) {
        console.error('[CART][UPDATE_ALL]', error);
        res.status(500).json({
            error: 'Error al actualizar productos del carrito',
        });
    }
};

// Endpoint para actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({
                error: 'Cantidad inválida. Debe ser un numero mayor a cero',
            });
        }

        const cart = await Cart.findById(cid);
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        const item = cart.products.find((p) => p.product.toString() === pid);
        if (!item)
            return res
                .status(404)
                .json({ error: 'Producto no está en el carrito' });

        const nuevaCantidad = item.quantity + quantity;

        if (nuevaCantidad > Product.stock) {
            return res.status(400).json({
                error: `Stock insuficiente. Solo hay ${Product.stock} unidades disponibles.`,
            });
        }

        item.quantity = nuevaCantidad;

        const updatedCart = await cart.save();

        res.status(200).json({ products: updatedCart.products });
    } catch (error) {
        console.error('[CART][UPDATE_QUANTITY]', error);
        res.status(500).json({
            error: 'Error al actualizar cantidad del producto',
        });
    }
};

// Endpoint para vaciar el carrito
export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart)
            return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];
        const updatedCart = await cart.save();

        res.status(200).json({
            message: 'Carrito vaciado',
            products: updatedCart.products,
        });
    } catch (error) {
        console.error('[CART][CLEAR]', error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
};
