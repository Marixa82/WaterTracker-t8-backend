import Jimp from "jimp";
import { User } from "../models/userModel.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "..", "public", "avatars");

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  const image = await Jimp.read(resultUpload);
  image.resize(28, 28);
  image.writeAsync(resultUpload);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
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
