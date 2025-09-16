import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authJwt } from '../middlewares/authJWT.js';

const router = Router();

router.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: 'failregister',
    }),
    async (req, res) => {
        res.send({ status: 'success', message: 'Usuario registrado' });
    }
);

router.post(
    '/login',
    passport.authenticate('login', { session: false }),
    async (req, res) => {
        if (!req.user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const palabra = process.env.SECRET_KEY;
        const { email, password, role } = req.user;

        const token = jwt.sign({ email, password, role }, palabra, {
            expiresIn: '1h',
        });

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
        });
    }
);

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err)
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        res.json({ message: 'Sesión cerrada correctamente' });
    });
});

router.get('/current', authJwt, (req, res) => {
    const { first_name, last_name, email, age, role, cart } = req.user;

    res.json({
        message: 'Usuario autenticado',
        user: {
            first_name,
            last_name,
            email,
            age,
            role,
            cart,
        },
    });
});

router.get('/failregister', (req, res) => {
    res.status(400).json({
        message: 'Error email no disponible para registro',
    });
});
router.get('/faillogin', (req, res) => {
    res.status(400).json({
        message: 'Error : Usuario o contraseña inexistente',
    });
});

export default router;
