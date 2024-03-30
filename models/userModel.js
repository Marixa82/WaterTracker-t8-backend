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
        name: {
            type: String,
            default: '',
        },
        avatarURL: {
            type: String,
        },
        waterRate: {
            type: Number,
            default: 2000
        },
        waters: {
            type:
                [{
                    month: {
                        type: String,
                        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    },
                    year: {
                        type: String,
                    },
                    useWater: {
                        type: [{
                            day: String,
                            waterRateForThisDay: Number,
                            useForDay: {
                                type: [{ id: String, time: String, amount: Number }],
                            },
                            allAmountforDay: Number
                        }],
                    }
                }],
            default: []
                     
        }
    },
    { versionKey: false, timestamps: true }
);

export const User = model("auth", userSchema);

export const registerSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).max(64).required(),
});

export const waterAddedSchema = Joi.object({
    time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
})