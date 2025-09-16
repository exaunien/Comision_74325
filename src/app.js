import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config.js';
import productsRouter from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import userRouter from './routes/user.router.js';
import sesionRouter from './routes/sesion.router.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'sessionSecret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 600000 }, // 10 minutos
    })
);

connectDB(); // Conexión activa

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRoutes);
app.use('/api/users', userRouter);
app.use('/api/sessions', sesionRouter);

// Listener
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
