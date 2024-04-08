import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/auth-router.js";
import { waterRouter } from "./routes/water-router.js";
import { userRouter } from "./routes/user-router.js";
import { deleteUnverifiedUsers } from "./helpers/index.js";
setInterval(deleteUnverifiedUsers, 24 * 60 * 60 * 1000);
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/auth", authRouter);
app.use("/api/waters", waterRouter);
app.use("/api/user", userRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
