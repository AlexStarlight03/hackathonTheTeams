import type { Request, Response } from "express";
import prisma from '../prisma/prisma';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

export const login = async (req: Request, res: Response) =>{
    const { email, password} = req.body;

    const user = await prisma.user.findUnique({
        where: {email},
        include: {groupesModerateur: true}
    });
    if(!user) return res.status(400).json({message:' Utilisateur non trouve !'});

    const motDePasseValide = await bcrypt.compare(password, user.mot_de_passe)
    if(!motDePasseValide) return res.status(400).json({message: 'Mot de passe incorrect !'});

    const token = jwt.sign(
        {sub: user.id,
        email: user.email,
        professionnel: user.professionnel,
        groupesModerateur: user.groupesModerateur
    },
        process.env.JWT_SECRET as string,
        {expiresIn: '1h'}
    )

    return res.status(200).json({
        success: true,
        message: 'Connexion reussie !',
        token,
        user: {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            professionnel: user.professionnel,
            groupesModerateur: user.groupesModerateur
        }
    })
}

export const register = async (req: Request, res: Response) => {
    const { nom, prenom, email, password} = req.body;

    const existingUser = await prisma.user.findUnique({ where: {email}});
    if(existingUser){
        return res.status(400).json({message:'User existe deja avec cet email !'})
    }

    const hashedPassword = await bcrypt.hash(password, 10,);
    const newUser = await prisma.user.create({
        data:{nom, prenom, email, mot_de_passe: hashedPassword}
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
