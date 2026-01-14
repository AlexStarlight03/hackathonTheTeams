import prisma from '../prisma/prisma';
import type { Request, Response } from "express";

export async function createEvenement(req: Request, res: Response) {
    const { nom, groupeId, date, description } = req.body;
    const id_moderateur = Number(req.params.userId);
    if (!id_moderateur || !nom || !groupeId || !date || !description) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs sont obligatoires pour créer un événement'
        });
    }
    try {
        // check if groupe exists
        const groupe = await prisma.group.findUnique({
            where: { id: groupeId }
        });
        if (!groupe) {
            return res.status(404).json({
                success: false,
                message: 'Groupe non trouvé pour créer un événement'
            });
        }

        // check if moderateur exists
        const moderateur =  await prisma.user.findUnique({
            where: { id: id_moderateur }
        });
        if (!moderateur) {
            return res.status(404).json({
                success: false,
                message: 'Modérateur non trouvé pour créer un événement'
            });
        }

        //check if moderateur is a moderateur of the group
        const isModerateur = await prisma.group.findFirst({
            where: {
                id: groupeId,
                moderateurs: {
                    some: { id: id_moderateur }
                }
            }
        });
        if (!isModerateur) {
            return res.status(403).json({
                success: false,
                message: 'L\'utilisateur n\'est pas modérateur de ce groupe'
            });
        }

        const newEvenement = await prisma.evenement.create({
            data: {
                id_moderateur,
                nom,
                groupeId,
                date: new Date(date),
                description
            }
        });
        return res.status(200).json({
        success: true,
        data: newEvenement,
        message: `L'evenement ${nom} a été créé avec succès.`
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de l\'événement'
        });
    }
}
export async function getAllEvenements(req: Request, res: Response) {
    try{
        const events = await prisma.evenement.findMany({
            include: {
                groupe: true
            }
        });

        res.status(200).json({
            success: true,
            data: events
        });

    } catch (error: any){
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des evenements',
            error: error.message
        })
    }
}

export async function getEvenementById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const evenement = await prisma.evenement.findUnique({
        where: { id },
        include: {
            groupe: true
        }
    });
    res.json(evenement);
}


export async function updateEvenement(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    const { nom, date, description } = req.body;
    const updateData: { nom?: string; date?: Date; description?: string}={}
    if(nom) updateData.nom = nom;
    if (date) updateData.date = new Date(date);
    if(description) updateData.description = description;

    // verifier si l'événement existe
    const evenement = await prisma.evenement.findUnique({
        where: { id }
    });
    if(!evenement){
        return res.status(404).json({
            success: false,
            message: `L'événement avec l'ID ${id} n'existe pas.`
        });
    }
    // verifier si l'utilisateur est le moderateur de l'événement
    if(evenement.id_moderateur !== userId){
        return res.status(403).json({
            success: false,
            message: `L'utilisateur avec l'ID ${userId} n'est pas le modérateur de cet événement.`
        });
    }
    try {
        const evenement = await prisma.evenement.update({
            where: { id: id,},
            data: updateData
        })

        res.status(200).json({
            success: true,
            data:evenement
        })
    } catch (error: any){
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification du groupe'
        })
        console.log(error);
    }
}


export async function deleteEvenement(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userId = Number(req.body.userId);

    // verifier si l'événement existe
    const evenement = await prisma.evenement.findUnique({
        where: { id }
    });
    if(!evenement){
        return res.status(404).json({
            success: false,
            message: `L'événement avec l'ID ${id} n'existe pas.`
        });
    }
    // verifier si l'utilisateur est le moderateur de l'événement
    if(evenement.id_moderateur !== userId){
        return res.status(403).json({
            success: false,
            message: `L'utilisateur avec l'ID ${userId} n'est pas le modérateur de cet événement.`
        });
    }
    try {
        const deletedEvenement = await prisma.evenement.delete({
            where: { id }
        });
        return res.status(200).json({
            success: true,
            data: deletedEvenement,
            message: `L'événement avec l'ID ${id} a été supprimé avec succès.`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression de l\'événement'
        });
    }
}

export async function getEvenementsByGroupId(req: Request, res: Response) {
    const groupId  = Number(req.params.groupId);
    try {
        const evenements = await prisma.evenement.findMany({
            where: { groupeId: groupId }
        });
        return res.status(200).json({
            success: true,
            data: evenements
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des événements du groupe'
        });
    }
}