import Jimp from "jimp";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcryptjs from "bcryptjs";
import { HttpError } from "../helpers/index.js";
import { Water } from "../models/waterModel.js";

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const allowedFormats = ["png", "jpeg"];

  const image = await Jimp.read(tempUpload);

  const format = image.getExtension();
  if (!allowedFormats.includes(format)) {
    throw new Error("Формат зображення не підтримується.");
  }

  image.resize(28, 28);
  await image.writeAsync(tempUpload);

  const filename = `${_id}_${originalname}`;

  const cloudinaryResult = await cloudinary.uploader.upload(tempUpload, {
    folder: "avatars",
    public_id: filename,
    overwrite: true,
  });

  await User.findByIdAndUpdate(_id, { avatarURL: cloudinaryResult.secure_url });

  res.json({
    avatarURL: cloudinaryResult.secure_url,
  });
};

export const getUserInfo = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).select(
    "avatarURL email name waterRate gender verify"
  );

  res.status(200).send({
    email: user.email,
    avatarURL: user.avatarURL,
    name: user.name,
    waterRate: user.waterRate,
    gender: user.gender,
    verify: user.verify,
  });
};

export const updateInfo = async (req, res) => {
  const { id } = req.user;
  const { email, newPassword, name, gender, outdatedPassword } = req.body;

  if (!email && !name && !gender && !newPassword && !outdatedPassword)
    throw HttpError(400, "Must be at least one field");

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const updatedUser = await User.findById(id);
  let hashPass;

  if (newPassword && outdatedPassword) {
    const isCorrectPass = await bcryptjs.compare(outdatedPassword, updatedUser.password);
    
      if (!isCorrectPass) {
        throw HttpError(400, "Old password is wrong");
      }
      
      hashPass = await bcryptjs.hash(newPassword, 10);
  }
  
  const result = await User.findByIdAndUpdate(id, {
    "email": email ?? updatedUser.email,
    "name": name ?? updatedUser.name,
    "gender": gender ?? updatedUser.gender,
    "password": hashPass ?? updatedUser.password
  }, {
      new: true,
    });

  res.status(200).json({
    email: result.email,
    avatarURL: result.avatarURL,
    name: result.name,
    waterRate: result.waterRate,
    gender: result.gender,
    verify: result.verify,
    
  });
};

export const deleteController = async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndDelete(id);
  await Water.deleteMany({ owner: id });

  res.status(204).json();
};
