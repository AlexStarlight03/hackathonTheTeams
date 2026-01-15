import prisma from '../prisma/prisma';
import type { Request, Response } from "express";

export async function  createProfessionnel (req: Request, res: Response) {
    try {
        const rawId = (req.params.id) as string | number | undefined;
        if (!rawId) return res.status(400).json({ error: 'Un utilisateur est requis' });

        const id = isNaN(Number(rawId)) ? (rawId as string) : Number(rawId);

        const user = await prisma.user.findUnique({ where: { id: id as any } });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        if (user.professionnel) return res.status(400).json({ error: "L'utilisateur est déjà un professionnel" });

        const qualification =
          typeof req.body.qualifications === 'string'
            ? req.body.qualifications
            : JSON.stringify(req.body.qualifications ?? '');

            
        const professionnel = await prisma.professionnel.create({
            data: {
                id: id as any,
                qualification,
            }
        });

        const updatedUser = await prisma.user.update({
            where: { id: id as any },
            data: { professionnel: true, professionnelProfil: { connect: { id: professionnel.id } } }
        });
        
        return res.status(201).json({ user: updatedUser, professionnel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la création du professionnel" });
    }
}

export async function  getAllProfessionnels (req: Request, res: Response) {
    try {
        const professionnels = await prisma.professionnel.findMany({
            include: { user: { select: { id: true, nom: true, prenom: true, email: true} } }
        });
        res.status(200).json({success: true,data: professionnels,});
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des professionnels", error: error });
    }
}

export async function  getProfessionnelById (req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID professionnel invalide' });
    try {
        const professionnel = await prisma.professionnel.findUnique({
            where: { id },
            include: { user: { select: { id: true, nom: true, prenom: true, email: true} } }
        })
        if (!professionnel) {
            return res.status(404).json({ error: 'Professionnel non trouvé' });
        }
        res.status(200).json({ professionnel });
    } catch (error) {
        res.status(500).json({ error: "Erreur de serveur lors de la récupération du professionnel" });
    }
}

export async function  updateProfessionnel (req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID professionnel invalide' });
    try {
        const professionnel = await prisma.professionnel.findUnique({ where: { id } });
        if (!professionnel) {
            return res.status(404).json({ error: 'Professionnel non trouvé' });
        }

        const qualification =
          typeof req.body.qualifications === 'string'
            ? req.body.qualifications
            : JSON.stringify(req.body.qualifications ?? professionnel.qualification);

        const userProRaw = req.body.professionnel ?? req.body.userProfessionnel;
        let userProfessionnel: boolean | undefined;
        if (typeof userProRaw === 'string') {
            userProfessionnel = userProRaw.toLowerCase() === 'true';
        } else if (typeof userProRaw === 'boolean') {
            userProfessionnel = userProRaw;
        }

        if (userProfessionnel === undefined) {
            const updatedProfessionnel = await prisma.professionnel.update({
                where: { id },
                data: { qualification },
            });
            return res.status(200).json({ professionnel: updatedProfessionnel });
        }

        if (userProfessionnel === true) {
            const [updatedUser, updatedProfessionnel] = await prisma.$transaction([
                prisma.user.update({
                    where: { id: professionnel.id as any },
                    data: { professionnel: true },
                }),
                prisma.professionnel.update({
                    where: { id },
                    data: { qualification },
                }),
            ]);
            return res.status(200).json({ user: updatedUser, professionnel: updatedProfessionnel });
        } else {
            const [updatedUser] = await prisma.$transaction([
                prisma.user.update({
                    where: { id: professionnel.id as any },
                    data: { professionnel: false },
                }),
                prisma.professionnel.delete({
                    where: { id },
                }),
            ]);
            return res.status(200).json({ user: updatedUser, professionnel: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur de serveur lors de la mise à jour du professionnel" });
    }
}

export async function  deleteProfessionnel (req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID professionnel invalide' });
    try {
        const professionnel = await prisma.professionnel.findUnique({ where: { id } });
        if (!professionnel) {
            return res.status(404).json({ error: 'Professionnel non trouvé' });
        }
        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { id: professionnel.id as any },
                data: { professionnel: false },
            }),
            prisma.professionnel.delete({
                where: { id },
            }),
        ]);
        return res.status(200).json({ user: updatedUser, message: 'Professionnel supprimé avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur de serveur lors de la suppression du professionnel" });
    }
}