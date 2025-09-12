import Product from '../models/products.model.js';
import mongoose from 'mongoose';

// Listar productos con paginación, ordenamiento y filtrado por categoría
export const getProductsPaginated = async (req, res) => {
    // Paginación
    // Por defecto, se muestran 10 productos por página
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Orden por precio
    // Validar el parámetro de ordenamiento
    const validoSorts = ['asc', 'desc'];
    const sort = validoSorts.includes(req.query.sort) ? req.query.sort : 'asc';
    const sortOption = { price: sort === 'desc' ? -1 : 1 };

    // Si hay una categoría seleccionada, filtrar por ella
    const category = req.query.category || null;
    const query = {
        status: true,
        ...(category && { category: category }),
    };

    try {
        const result = await Product.paginate(query, {
            page,
            limit,
            sort: sortOption,
            lean: false,
        });

        if (!result.docs || result.docs.length === 0) {
            return res
                .status(404)
                .json({ message: 'No se encontraron productos' });
        }
        const responseData = {
            productos: result.docs,
            sort,
            category,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            currentPage: result.page,
            totalPages: result.totalPages,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        console.log('PID recibido:', pid);

        // Validación de id de mongoose
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        const product = await Product.findById(pid).lean();

        if (!product || product.status !== true) {
            return res
                .status(404)
                .json({ error: 'Producto no encontrado o inactivo' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const {
            title,
            image,
            description,
            price,
            code,
            status,
            stock,
            category,
        } = req.body;

        // Validación básica de campos requeridos
        if (
            !title ||
            !image ||
            !description ||
            !price ||
            !code ||
            !status ||
            stock == null ||
            !category
        ) {
            return res
                .status(400)
                .json({ error: 'Faltan campos obligatorios' });
        }

        // Validación de tipos
        if (typeof price !== 'number' || typeof stock !== 'number') {
            return res
                .status(400)
                .json({ error: 'Precio y stock deben ser numéricos' });
        }

        const newProduct = new Product({
            title,
            image,
            description,
            price,
            code,
            status: true, // por defecto activo
            stock,
            category,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizacion de un producto
export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;

        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        const updateData = req.body;

        // Validación para asegurarse de que haya algo para actualizar
        if (!updateData || Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ error: 'No se proporcionaron datos para actualizar' });
        }

        // Actualizar el producto
        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            updateData,
            {
                new: true,
                runValidators: true,
                lean: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deleted = await Product.findByIdAndDelete(pid);
        if (!deleted)
            return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
