import express from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});