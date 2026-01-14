import { Router } from 'express';
import type { Request, Response } from "express";
import { login, logout, register } from '../controllers/auth.controller';
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post('/login', login);


router.get('/dashboard', authenticate, (req: Request, res: Response): void => {
    res.json({
    message: "Accès autorisé",
    user: req.user
    });
});
router.post('/logout', logout);
router.post("/register", register);

export default router;