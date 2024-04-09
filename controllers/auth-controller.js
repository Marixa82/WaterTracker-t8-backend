import { User } from "../models/userModel.js";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import {
  HttpError,
  sendEmail,
  emailVerify,
  emailTemporaryPassword,
} from "../helpers/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { randomBytes, randomUUID } from "crypto";
import { promisify } from "util";
import axios from "axios";
import queryString from "query-string";

const {
  JWT_SECRET,
  BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_URL,
} = process.env;

export const registerController = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const verificationCode = randomUUID();

  const hashPass = await bcryptjs.hash(password, 10);

  const index = email.split("").findIndex((symbol) => symbol === "@");
  const name = email.slice(0, index);
  await User.create({
    email,
    password: hashPass,
    avatarURL,
    name,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: emailVerify(verificationCode, `${BASE_URL}`),
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    message: "New user is created",
  });
};

export const verifyEmailController = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.status(200).redirect(`${FRONTEND_URL}/singin`);
};

export const resendVerifyEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(401, "Email already verify");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: emailVerify(user.verificationCode, BASE_URL),
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Verify email send success",
  });
};

export const loginController = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isCorrectPass = await bcryptjs.compare(password, user.password);

  if (!isCorrectPass) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token }, { new: true });
  res.status(200).json({
    message: `Login '${email}' successful`,
    token,
  });
};

export const logoutController = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).json();
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Not valid email.");
  }

  const temporaryPassword = (await promisify(randomBytes)(8)).toString("hex");
  const hashTemporaryPassword = await bcryptjs.hash(temporaryPassword, 10);

  user.password = hashTemporaryPassword;
  await user.save();

  const verifyEmail = {
    to: email,
    subject: "Password recovery",
    html: emailTemporaryPassword(temporaryPassword),
  };
  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Temporary password has been sent to your email.",
  });
};

export const googleAuth = async (req, res) => {
  const stringifyParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifyParams}`
  );
};

export const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const { email, id, picture, name, verified_email } = userData.data;
  const user = await User.findOne({ email });

  if (!user) {
    const hashTemporaryPassword = await bcryptjs.hash(id, 10);
    const newUser = await User.create({
      email,
      password: hashTemporaryPassword,
      avatarURL: picture,
      name,
      verify: verified_email,
    });

    const payload = { id: newUser.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    newUser.token = token;
    await newUser.save();

    return res.redirect(`${FRONTEND_URL}/signin/?token=${token}`);
  } else {
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    user.token = token;
    await user.save();

    return res.redirect(`${FRONTEND_URL}/?token=${token}`);
  }
};
