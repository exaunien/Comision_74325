import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        password: {
            type: String,
            required: true,
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
    },
    { timestamps: true }
);

export default model('User', userSchema);
