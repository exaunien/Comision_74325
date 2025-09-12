import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config.js';
import productsRouter from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import userRouter from './routes/user.router.js';
import sesionRouter from './routes/sesion.router.js';
import './config/passport.config.js'; // ✅ Esto registra la estrategia "jwt"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(); // Conexión activa

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRoutes);
app.use('/api/users', userRouter);
app.use('/api/sessions', sesionRouter);

// Listener
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
