import { User } from "../models/authmodel.js";
import HttpError from "../helpers/HttpError.js";
import 'dotenv/config';
import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env;

export const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
        next(HttpError(401, "Not authorized"))
    };
    
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401, "Not authorized"))
        }
        req.user = user;
        next();
    }catch {
        next(HttpError(401, "Not authorized"))
    }
}