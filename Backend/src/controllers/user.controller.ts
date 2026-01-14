import type { Request, Response } from 'express';
import prisma from '../prisma/prisma';

export async function getAllUsers (req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {id: true, nom: true, prenom: true, email: true, creation_date: true}
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
}
export async function getUserById (req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });
    try {
        if (req.user!.id !== id) {
            return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas accéder à cet utilisateur' });
        }
        const user = await prisma.user.findUnique({
            where: { id },
            select: {id: true, nom: true, prenom: true, email: true, creation_date: true}
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur de serveur lors de la récupération de l'utilisateur" });
    }








export async function createUser (req: Request, res: Response) {}
export async function updateUser (req: Request, res: Response) {}
export async function deleteUser (req: Request, res: Response) {}