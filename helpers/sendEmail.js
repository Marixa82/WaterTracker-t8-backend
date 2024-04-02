import "dotenv/config";
import { send, setApiKey } from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;
setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "vysotskymaxim124@gmail.com" };
  await send(email);
  return true;
};
