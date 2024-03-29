import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema(
    {
        password: {
            type: String,
            min: 8,
            max: 64,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        token: {
            type: String,
            default: null,
        },
        avatarURL: {
            type: String,
        },
    },
    { versionKey: false, timestamps: true }
);

export const User = model("auth", userSchema);

export const registerSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).max(64).required(),
});

