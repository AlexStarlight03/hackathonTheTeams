import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import discussionRoutes from "./routes/discussion.routes";
import groupRoutes from "./routes/group.routes";
import ressourceRoutes from "./routes/ressource.routes";
import evenementRoutes from "./routes/evenement.routes";
import journalRoutes from "./routes/journal.routes";
import messageRoutes from "./routes/message.routes";
import professionnelRoutes from "./routes/professionnel.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use('/auth', authRoutes);
app.use('/discussions', discussionRoutes);
app.use('/groups', groupRoutes);
app.use('/ressources', ressourceRoutes);
app.use('/evenements', evenementRoutes);
app.use('/journals', journalRoutes);
app.use('/messages', messageRoutes);
app.use('/professionnels', professionnelRoutes);
app.use('/users', userRoutes);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})