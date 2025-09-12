import User from '../models/users.model.js';
import Cart from '../models/carts.model.js';
import { createHash, isValidPassword, generateToken } from '../utils/utils.js';

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Validación básica
        if (!first_name || !last_name || !email || !age || !password) {
            return res
                .status(400)
                .json({ error: 'Faltan campos obligatorios' });
        }

        // Verificar duplicado
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(409).json({ error: 'El usuario ya existe' });

        // Crear carrito vacío
        const newCart = await Cart.create({ products: [] });

        // Hashear contraseña
        const hashedPassword = createHash(password);

        // Crear usuario
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id,
            role: 'user', // por defecto
        });

        // Respuesta limpia
        res.status(201).json({
            message: 'Usuario creado con éxito',
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                cart: newUser.cart,
            },
        });
    } catch (error) {
        console.error('[USER][REGISTER]', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacion usuario x email unico
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: 'Usuario no encontrado' });

        // Validacion password
        if (!isValidPassword(user, password)) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar JWT
        const token = generateToken(user);

        res.status(200).json({
            message: 'Login exitoso',
            token,
        });
    } catch (error) {
        console.error('[LOGIN]', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar usuario' });
    }
};

// Actualizar un usuario por ID
export const updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario actualizado', user: updated });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
