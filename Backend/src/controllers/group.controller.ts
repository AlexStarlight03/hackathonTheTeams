import prisma from '../prisma/prisma';
import type { Request, Response } from "express";




export const createGroup= async(req: Request, res: Response)=>{
    const { nom, description, createurId} = req.body;
    if (!nom || !description || !createurId) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs sont requis'
        });
    }

    const createur = await prisma.user.findUnique({
        where: { id: createurId }
    });

    if(!createur){
        return  res.status(400).json({
            success: false,
            message: 'L\'utilisateur n\'existe pas'
        })
    }

    const newgroup = await prisma.group.create({
        data: {createurId, nom, description}
    })

    res.json(newgroup)
} 

export const joinGroup = async(req: Request, res: Response) =>{
    const userId = Number(req.params.userId)
    const groupId = Number(req.params.groupId)

    // verifier si le groupe existe
    const group = await prisma.group.findUnique({
        where: { id: groupId},
        include: {membres: true}
    })

    if(!group){
        return res.status(404).json({
            success: false,
            message: 'Groupe n\'existe pas'
        })
    }

    // verifier si le user existe
    const user = await prisma.user.findUnique({
        where: { id: userId}
    })
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'L\'utilisateur n\'existe pas'
        })
    }

    // verifier si l'utilisateur est deja inscrit dans le groupe
    const isMember = group.membres.some(s => s.id === userId); // retourne true ou false
    // map ==> transforme un tableau en un autre tableau

    if(isMember){
        return res.status(400).json({
            success: false,
            message: 'L\'utilisateur est déjà inscrit dans ce groupe'
        })
    }

    // ajouter un utilisateur dans le groupe 
    const updatedGroup = await prisma.group.update({
        where: {id: groupId},
        data:{
            membres:{
                connect:{ id: userId }
            }
        },
        include: { 
            membres: true}
    })

    res.status(200).json({
        success: true,
        data: updatedGroup,
        message: `L'utilisateur ${userId} inscrit avec succès dans le groupe`
    })
}

export const leaveGroup = async(req: Request, res: Response) =>{
    const userId = Number(req.params.userId)
    const groupId = Number(req.params.groupId)

    // verifier si le group existe
    const group = await prisma.group.findUnique({
        where: { id: groupId},
        include: {membres: true, moderateurs: true}
    })

    if(!group){
        return res.status(404).json({
            success: false,
            message: 'Groupe n\'existe pas'
        })
    }

    // verifier si le user existe
    const user = await prisma.user.findUnique({
        where: { id: userId}
    })
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'L\'utilisateur n\'existe pas'
        })
    }

     // verifier si l'utilisateur est inscrit dans le groupe
    const isMember = group.membres.some(s => s.id === userId); // retourne true ou false
    if(!isMember){
        return res.status(400).json({
            success: false,
            message: `L\'utilisateur ${userId} n\'est pas inscrit dans ce club`
        })
    }

    // verifier si l'utilisateur est moderateur dans le groupe
    const isModerateur = group.moderateurs.some(s => s.id === userId); // retourne true ou false
    if(isModerateur){
        return res.status(400).json({
            success: false,
            message: `L\'utilisateur ${userId} est moderateur dans ce club. Il doit d'abord être retiré en tant que moderateur avant de quitter le groupe.`
        })
    }

    // retirer un utilisateur du groupe
    const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data:{
            membres:{
                disconnect : { id: userId}
            }
        },
        include: {
            membres: true
        }
    })

    res.status(200).json({
        success: true,
        data: updatedGroup,
        message: `L'utilisateur ${userId} a quitté avec succès le groupe ${groupId}`
    })
}

export const getGroups= async(req: Request, res: Response)=>{
    try{
        const groups = await prisma.group.findMany({
            include: {
                membres: true,
                createur: true
            }
        });

        res.status(200).json({
            success: true,
            data: groups
        });

    } catch (error: any){
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des groupes',
            error: error.message
        })
    }
}

export const getGroupById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid group id' });
    }
    const group = await prisma.group.findUnique({
        where: { id },
        include: {
            membres: true,
            createur: true,
            moderateurs: true
        }
    });
    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }
    res.json({ data: group });
};

export const deleteGroup= async(req: Request, res: Response)=>{
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);

    //check if group exists and if user is the creator of the group
    const groupToUpdate = await prisma.group.findUnique({
        where: { id }
    });
    if (!groupToUpdate || groupToUpdate.createurId !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Seul le créateur du groupe peut le supprimer'
        });
    }
    await prisma.group.delete({
        where: { id }
    });
    res.status(200).json({
        success: true, 
        message : `Groupe avec l'id ${id} supprimé avec succès`})
}


export const updateGroup= async(req: Request, res: Response)=>{
    try{
        const id = Number(req.params.id);
        const userId = Number(req.params.userId);
        const { nom, description, new_inscription} = req.body;

        //check if group exists and if user is the creator of the group
        const groupToUpdate = await prisma.group.findUnique({
            where: { id }
        });
        if (!groupToUpdate || groupToUpdate.createurId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Seul le créateur du groupe peut le modifier'
            });
        }

        const updateData: { nom?: string; description?: string; new_inscription?: boolean}={}
        if(nom) updateData.nom = nom;
        if(description) updateData.description = description;
        if(new_inscription) updateData.new_inscription = new_inscription;

        const group = await prisma.group.update({
            where: { id},
            data: updateData
        })

        res.status(200).json({
            success: true,
            data:group
        })
    } catch (error: any){
        if(error.code === 'P2025'){ // En cas ou absence dans la base de donnee
            return res.status(404).json({
                success: false,
                message: 'Groupe non trouvé'
            })
        }

        if(error.code === 'P2002'){ // En cas ou repetition d'un unique
            return res.status(404).json({
                success: false,
                message: 'Nom de groupe déjà utilisé'
            })
        }

        res.status(500).json({
            message: 'Erreur lors de la modification du groupe',
            success: false,
            error: error.message
        })

        console.log(error);
    }
}

export const addModerateur = async(req: Request, res: Response) =>{
    const userId = Number(req.params.userId)
    const groupId = Number(req.params.groupId)

    // verifier si le groupe existe
    const group = await prisma.group.findUnique({
        where: { id: groupId},
        include: {membres: true, moderateurs: true}
    })

    if(!group){
        return res.status(404).json({
            success: false,
            message: 'Groupe n\'existe pas'
        })
    }

    // verifier si le user existe
    const user = await prisma.user.findUnique({
        where: { id: userId}
    })
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'L\'utilisateur n\'existe pas'
        })
    }

    // verifier si l'utilisateur est deja inscrit dans le groupe
    const isMember = group.membres.some(s => s.id === userId); // retourne true ou false
    if(!isMember){
        return res.status(400).json({
            success: false,
            message: 'L\'utilisateur n\'est pas inscrit dans ce groupe'
        })
    }
    // verifier si l'utilisateur est moderateur dans le groupe
    const isModerateur = group.moderateurs.some(s => s.id === userId); // retourne true ou false
    if(isModerateur){
        return res.status(400).json({
            success: false,
            message: `L\'utilisateur ${userId} est deja moderateur dans ce groupe.`
        })
    }


    // ajouter un utilisateur comme moderateur du groupe
    const updatedGroup = await prisma.group.update({
        where: {id: groupId},
        data:{
            moderateurs:{
                connect:{ id: userId }
            }
        },
        include: { 
            moderateurs: true}
    })

    res.status(200).json({
        success: true,
        data: updatedGroup,
        message: `L'utilisateur ${userId} est maintenant modérateur du groupe`
    })
}

export const deleteModerateur = async(req: Request, res: Response) =>{
    const userId = Number(req.params.userId)
    const groupId = Number(req.params.groupId)

    // verifier si le group existe
    const group = await prisma.group.findUnique({
        where: { id: groupId},
        include: {membres: true, moderateurs: true}
    })

    if(!group){
        return res.status(404).json({
            success: false,
            message: 'Groupe n\'existe pas'
        })
    }

    // verifier si le user existe
    const user = await prisma.user.findUnique({
        where: { id: userId}
    })
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'L\'utilisateur n\'existe pas'
        })
    }

     // verifier si l'utilisateur est inscrit dans le groupe
    const isMember = group.membres.some(s => s.id === userId); // retourne true ou false
    if(!isMember){
        return res.status(400).json({
            success: false,
            message: `L\'utilisateur ${userId} n\'est pas inscrit dans ce club`
        })
    }

    // verifier si l'utilisateur est moderateur dans le groupe
    const isModerateur = group.moderateurs.some(s => s.id === userId); // retourne true ou false
    if(!isModerateur){
        return res.status(400).json({
            success: false,
            message: `L\'utilisateur ${userId} n'est pas moderateur dans ce club.`
        })
    }

    // retirer un utilisateur comme moderateur du groupe
    const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data:{
            moderateurs:{
                disconnect : { id: userId}
            }
        },
        include: {
            moderateurs: true
        }
    })

    res.status(200).json({
        success: true,
        data: updatedGroup,
        message: `L'utilisateur ${userId} n'est plus modérateur du groupe ${groupId}`
    })
}