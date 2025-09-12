import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hashear la contraseña
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar la contraseña
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

// Generar JWT
export const generateToken = (user) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        SECRET_KEY,
        { expiresIn: '1h' } // Token válido por 1 hora
    );
};
