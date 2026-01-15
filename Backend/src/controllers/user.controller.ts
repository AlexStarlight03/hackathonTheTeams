import type { Request, Response } from 'express';
import prisma from '../prisma/prisma';

export async function getAllUsers (req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            include: {
                professionnelProfil: true,
                groupesModerateur: true,
                groupes: true,
                eventModerateur: true,
                conversations: true,
                messagesEnvoyes: true,
                journal: true
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
}

export async function getUserById (req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });
    const userId = Number(id);
    if (Number.isNaN(userId)) return res.status(400).json({ error: 'ID utilisateur invalide' });
    try {
        if (Number(req.user!.id) !== userId) {
            return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas accéder à cet utilisateur' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {id: true, nom: true, prenom: true, email: true, creation_date: true}
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ error: "Erreur de serveur lors de la récupération de l'utilisateur" });
    }
}


export async function createUser (req: Request, res: Response) {
    try {
        const { nom, prenom, email, mot_de_passe } = req.body;
        if (!nom || !prenom || !email || !mot_de_passe) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà' });
        }
        const newUser = await prisma.user.create({
            data: { nom, prenom, email, mot_de_passe }
        });
        res.status(201).json({ id: newUser.id, nom: newUser.nom, prenom: newUser.prenom, email: newUser.email, creation_date: newUser.creation_date });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
}

export async function updateUser (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nom, prenom, email, mot_de_passe } = req.body;
        if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });
        const userId = Number(id);
        if (Number.isNaN(userId)) return res.status(400).json({ error: 'ID utilisateur invalide' });
        if (Number(req.user!.id) !== userId) {
            return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas modifier cet utilisateur' });
        }
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                nom: nom ?? existingUser.nom,
                prenom: prenom ?? existingUser.prenom,
                email: email ?? existingUser.email,
                mot_de_passe: mot_de_passe ?? existingUser.mot_de_passe
            },
            select: {id: true, nom: true, prenom: true, email: true, creation_date: true}
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
}

export async function deleteUser (req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });
        const userId = Number(id);
        if (Number.isNaN(userId)) return res.status(400).json({ error: 'ID utilisateur invalide' });
        if (Number(req.user!.id) !== userId) {
            return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas supprimer cet utilisateur' });
        }
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        await prisma.user.delete({ where: { id: userId } });
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
}