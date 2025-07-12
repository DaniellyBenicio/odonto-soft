import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth/authRoutes.js";
import userRoutes from "./routes/admin/userRoutes.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
