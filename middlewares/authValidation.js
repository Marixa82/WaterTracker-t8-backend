import { User } from "../models/userModel.js";
import { HttpError } from "../helpers/index.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const authValidation = async (req, res, next) => {
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
    } catch {
        next(HttpError(401, "Not authorized"))
    }
}
export default authValidation;