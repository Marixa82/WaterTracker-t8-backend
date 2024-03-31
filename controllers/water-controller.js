import {HttpError}from "../helpers/index.js";
import { User } from "../models/userModel.js";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
    const { date, time, waterAmount } = req.body;
    let sep
    if (date.includes('/')) sep = '/'
    else if (date.includes('-')) sep = '-'
    const [day, month, year] = date.split(sep);

    const waterData = {
        day,
        month: months[Number(month) - 1],
        year,
        time,
        amount: waterAmount
    }

    await User.findByIdAndUpdate(id, { $push: { waters: waterData } }, { new: true });
    return res.json({
        "message": "New water portion is added successful",
        waterData
    })
};

export const deleteWaterController = async (req, res) => {
    const { id} = req.user
    const { id: waterId } = req.params;
    const {waters} = await User.findById(id);
    const waterPortion = waters.find(water => water._id.toString() === waterId);
    if (!waterPortion) throw HttpError(404, `There are no portions with id ${waterId}`)

    await User.findByIdAndUpdate(id, { $pull: { waters: { _id: waterId } } }, { new: true });
    return res.status(204)

};

export const updateWaterController = async (req, res) => {
    const { id } = req.user
    const { id: waterId } = req.params;
    const { time, waterAmount } = req.body;
    const {waters} = await User.findById(id);
    const waterPortion = waters.find(water => water._id.toString() === waterId);
    if (!waterPortion) throw HttpError(404, `There are no portions with id ${waterId}`)
    
    if (!time && !waterAmount) throw HttpError(400, "Must be at least one field");
    if (time) waterPortion.time = time
    if(waterAmount) waterPortion.amount = waterAmount

    await User.findByIdAndUpdate(id, { $pull: { waters: { _id: waterId } } }, { new: true });
    await User.findByIdAndUpdate(id, { $push: { waters: {...waterPortion}} }, { new: true })
        return res.json({
            "message": "Water portion is updated successful",
            waterPortion
        })

}
