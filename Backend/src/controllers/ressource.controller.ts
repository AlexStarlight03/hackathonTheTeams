import prisma from '../prisma/prisma';
import type { Request, Response } from "express";

// model Ressource {
//   id             Int    @id @default(autoincrement())
//   professionalId Int
//   nom            String @db.VarChar(125)
//   description    String

//   professionnel Professionnel @relation(fields: [professionalId], references: [id])

// }

export async function  createRessource (req: Request, res: Response) {
    const id = Number(req.params.userId);
    const { nom, description, professionnel } = req.body;
    const professionalId = professionnel?.id;

    if (!nom || !description || !professionalId) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs sont obligatoires pour créer une ressource'
        });
    }
    try {
        //check if user is a professional
        const isProfessional = await prisma.professionnel.findUnique({
            where: { id: professionalId }
        });
        if (!isProfessional) {
            return res.status(403).json({
                success: false,
                message: 'L\'utilisateur n\'est pas est professionnel et ne peux créer une ressource'
            });
        }

        const newRessource = await prisma.ressource.create({
            data: {
                professionalId,
                nom,
                description
            }
        });
        return res.status(200).json({
        success: true,
        data: newRessource,
        message: `La ressource ${nom} a été créé avec succès.`
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de la ressource'
        });
    }
}

export async function  updateRessource (req: Request, res: Response) {
    const id = Number(req.params.userId);
    const idRessource = Number(req.params.id);
    const { nom, description } = req.body;
    const updateData: { nom?: string; description?: string}={}
    if(nom) updateData.nom = nom;
    if(description) updateData.description = description;
    try {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        //check if ressource existe
        const ressource = await prisma.ressource.findFirst({
            where: { id: idRessource }
        });
        if (!ressource) {
            return res.status(403).json({
                success: false,
                message: 'La ressource n\'existe pas'
            });
        }

        // check if user has created the ressource
        if (ressource?.professionalId !== id) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur n\'a pas créé cette ressource'
            });
        }

        const updatedRessource = await prisma.ressource.update({
            where: { id: idRessource},
            data: updateData
        })

        res.status(200).json({
            success: true,
            data:updatedRessource
        })
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la modification de la ressource'
        });
    }
}


export async function  deleteRessource (req: Request, res: Response) {
    const id = Number(req.params.userId);
    const idRessource = Number(req.params.id);
    try {
        //check if ressource existe
        const ressource = await prisma.ressource.findFirst({
            where: { id: idRessource }
        });
        if (!ressource) {
            return res.status(403).json({
                success: false,
                message: 'La ressource n\'existe pas'
            });
        }

        // check if user has created the ressource
        if (ressource?.professionalId !== id) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur n\'a pas créé cette ressource'
            });
        }

        await prisma.ressource.delete({
            where: { id: idRessource}
        })
        res.status(200).json({
        success: true, 
        message : `Groupe avec l'id ${id} supprimé avec succès`})
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la suppression de la ressource'
        });
    }

}

export async function  getAllRessources (req: Request, res: Response) {
    const ressources =  await prisma.ressource.findMany();
    return res.status(200).json({
        success: true,
        data: ressources
    });
}

export async function  getRessourceById (req: Request, res: Response) {
    const idRessource = Number(req.params.id);
    const ressource =  await prisma.ressource.findUnique({
        where: { id: idRessource }
    });
    if (!ressource) {
        return res.status(404).json({
            success: false,
            message: 'Ressource non trouvée'
        });
    }
    return res.status(200).json({
        success: true,
        data: ressource
    });

}
