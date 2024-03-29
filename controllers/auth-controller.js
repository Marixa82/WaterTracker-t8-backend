import { User } from "../models/userModel.js";
import gravatar from 'gravatar';
import bcryptjs from 'bcryptjs'
import { HttpError } from "../helpers/index.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env

export const registerController = async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }
    const avatarURL = gravatar.url(email);
    const hashPass = await bcryptjs.hash(password, 10);
    // const verificationToken = nanoid();
    const newUser = await User.create({ email, password: hashPass, avatarURL });

    const payload = { id: newUser.id }
    const token = jwt.sign(payload, JWT_SECRET)
    await User.findByIdAndUpdate(newUser.id, { token }, { new: true });

    res.status(201).json({
        "message": "New user is created",
        email,
        token
    });
}

export const loginController = async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    // if (!user.verify) {
    //     throw HttpError(401, "Email is not verified");
    // }
    const isCorrectPass = await bcryptjs.compare(password, user.password);

    if (!isCorrectPass) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    res.status(200).json({
        "message": "Login successful",
        token,
        'email': user.email,
        "avatar": user.avatar
    })
}

export const logoutController = async (req, res) => {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).json()
}
