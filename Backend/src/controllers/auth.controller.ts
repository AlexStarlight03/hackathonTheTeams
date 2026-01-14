import { Request, Response } from "express";
import prisma from '../prisma/prisma';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

interface LoginBody {
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response) => {
  	const { email, password } = req.body;
 	
	const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
    	return res.status(400).json({ message: "Utilisateur non existant." });
    }

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ message: "Mot de passe incorrect." });
	}
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

    if (!secret) {
        return res.status(500).json({ message: "JWT secret not configured" });
    }

	try {
		const token = jwt.sign(
		{
			sub: user.id,
			email: user.email
		},
		secret,
		{ expiresIn: expiresIn }
		);

		return res.status(200).json({ 
			success: true,
			message: "Authentification réussie",
			token 
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Erreur lors de la génération du token"
		});
	}
};

export const register = async (req: Request, res: Response) => {
    const { nom, prenom, email, password} = req.body;

    const existingUser = await prisma.user.findUnique({ where: {email}});
    if(existingUser){
        return res.status(400).json({message:'User existe deja avec cet email !'})
    }

    const hashedPassword = await bcrypt.hash(password, 10,);
    const newUser = await prisma.user.create({
        data:{nom, prenom, email, password: hashedPassword}
    })

    return res.status(201).json({
        success: true,
        message: 'Utilisateur enregistre avec succes !',
        newUser
    })
}

export const logout = (req: Request, res: Response) => {
	return res.json({ message: "Déconnexion réussie" });
};
