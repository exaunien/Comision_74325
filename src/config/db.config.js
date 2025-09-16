import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🟢 Conectado a la base de datos');
    } catch (error) {
        console.error('🔴 Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};
