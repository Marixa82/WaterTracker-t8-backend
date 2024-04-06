import "dotenv/config";
import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "vysotskymaxim124@gmail.com" };
  await sgMail.send(email);
  return true;
};

export default sendEmail;
