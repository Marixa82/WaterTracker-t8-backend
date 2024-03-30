import { User } from "../models/userModel.js";

export const waterRateController = async (req, res) => {
    const { waterRate } = req.body;
    const { id } = req.user;

    await User.findByIdAndUpdate(id, { waterRate });
    res.status(200).json({
        'message': 'Water Rate was changed successful'
    });
};

export const addWaterController = async (req, res) => {
    const { id } = req.user;
    const { time } = req.body;
    res.json({
        time
    })
}
