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

  if (!user) {
    throw HttpError(404, "Not found");
  }

  res.status(200).send({
    avatarURL: user.avatarURL,
    email: user.email,
    name: user.name,
    waterRate: user.waterRate,
    gender: user.gender,
    verify: user.verify,
  });
};

export const updateInfo = async (req, res) => {
  const { id } = req.user;
  const { email, password, name, gender, outdatedPassword } = req.body;

  if (!email && !name && !gender && !password)
    throw HttpError(400, "Must be at least one field");

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  if (outdatedPassword) {
    if (!password) {
      throw HttpError(400, "You forgot to enter your new password");
    }
  }

  let hashPass;
  if (password) {
    if (!outdatedPassword) {
      throw HttpError(400, "You need to enter your outdated password.");
    }
    if (outdatedPassword === password) {
      throw HttpError(400, "You must enter new password.");
    }
    hashPass = await bcryptjs.hash(password, 10);
    req.body.password = hashPass;
  }

  const result =
    (await User.findByIdAndUpdate(id, req.body, {
      new: true,
    })) || null;

  if (result === null) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json({
    message: "The user data change was successful.",
  });
};

export const deleteController = async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;

  const isCorrectPass = await bcryptjs.compare(password, user.password);
  if (!isCorrectPass) {
    throw HttpError(401, "Password is wrong");
  }

  await User.findByIdAndDelete(id);
  await Water.deleteMany({ owner: id });

  res.status(204).json();
};
