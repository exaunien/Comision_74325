import User from '../models/users.model.js';

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
