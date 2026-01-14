import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})