import Jimp from "jimp";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

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
  const { id } = req.params;

  const user = await User.findById(id).select(
    "avatarURL email name waterRate gender"
  );

  if (!user) {
    return res.status(404).send({ message: "Not found" });
  }

  res.status(200).send(user);
};

export const updateInfo = async (req, res) => {
  const { id } = req.params;

  const result =
    (await User.findByIdAndUpdate(id, req.body, {
      new: true,
    })) || null;

  console.log(result);

  if (result === null) {
    return res.status(404).send({ message: "Not found" });
  }

  res.status(200).send(result);
};
