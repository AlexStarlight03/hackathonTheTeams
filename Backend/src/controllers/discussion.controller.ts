import prisma from '../prisma/prisma';
import type { Request, Response } from "express";

/**
 * Récupérer toutes les discussions
 */
export async function getAllDiscussion(req: Request, res: Response) {
  try {
    const discussions = await prisma.filDiscussion.findMany({
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        },
        messages: {
          orderBy: { time: 'desc' },
          take: 1,
          include: {
            emmeteur: {
              select: {
                id: true,
                nom: true,
                prenom: true
              }
            }
          }
        }
      }
    });

    res.status(200).json(discussions);
  } catch (error) {
    console.error('Erreur lors de la récupération des discussions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des discussions' });
  }
}

/**
 * Récupérer une discussions spécifique
 */
export async function getDiscussionById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID discussion invalide' });
    }

    const discussion = await prisma.filDiscussion.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        },
        messages: {
          orderBy: { time: 'desc' },
          take: 1,
          include: {
            emmeteur: {
              select: {
                id: true,
                nom: true,
                prenom: true
              }
            }
          }
        }
      }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée' });
    }

    res.status(200).json(discussion);
  } catch (error) {
    console.error('Erreur lors de la récupération de la discussion:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la discussion' });
  }
}

/**
 * Récupérer les discussions d'un utilisateur spécifique
 */
export async function getDiscussionByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId as string);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    const discussions = await prisma.filDiscussion.findMany({
      where: {
        participants: {
          some: {
            id: userIdInt
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        },
        messages: {
          orderBy: { time: 'desc' },
          take: 1,
          include: {
            emmeteur: {
              select: {
                id: true,
                nom: true,
                prenom: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.status(200).json(discussions);
  } catch (error) {
    console.error('Erreur lors de la récupération des discussions utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des discussions utilisateur' });
  }
}

/**
 * Récupérer les discussions d'un groupe
 */
export async function getDiscussionByGroupId(req: Request, res: Response) {
  try {
    const { groupId } = req.params;
    const groupIdInt = parseInt(groupId as string);

    if (isNaN(groupIdInt)) {
      return res.status(400).json({ error: 'ID groupe invalide' });
    }

    const discussions = await prisma.filDiscussion.findMany({
      where: {
        groupeId: groupIdInt
      },
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        },
        messages: {
          orderBy: { time: 'desc' },
          take: 1,
          include: {
            emmeteur: {
              select: {
                id: true,
                nom: true,
                prenom: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.status(200).json(discussions);
  } catch (error) {
    console.error('Erreur lors de la récupération des discussions de groupe:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des discussions de groupe' });
  }
}

/**
 * Créer une nouvelle discussion privée entre utilisateurs
 */
export async function postNewPrivateDiscussion(req: Request, res: Response) {
  try {
    const { titre, participantIds } = req.body;

    // Validation
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
      return res.status(400).json({ 
        error: 'Au moins 2 participants sont requis pour une discussion privée' 
      });
    }

    // Vérifier que tous les utilisateurs existent
    const users = await prisma.user.findMany({
      where: {
        id: { in: participantIds }
      }
    });

    if (users.length !== participantIds.length) {
      return res.status(400).json({ error: 'Un ou plusieurs utilisateurs n\'existent pas' });
    }

    // Créer la discussion
    const discussion = await prisma.filDiscussion.create({
      data: {
        titre: titre || null,
        groupeId: null, // Discussion privée, pas de groupe
        participants: {
          connect: participantIds.map((id: number) => ({ id }))
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Erreur lors de la création de la discussion privée:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la discussion privée' });
  }
}

/**
 * Créer une nouvelle discussion de groupe
 */
export async function postNewGroupDiscussion(req: Request, res: Response) {
  try {
    const { titre, groupeId, participantIds } = req.body;

    // Validation
    if (!groupeId) {
      return res.status(400).json({ error: 'L\'ID du groupe est requis' });
    }

    const groupeIdInt = parseInt(groupeId);

    // Vérifier que le groupe existe
    const groupe = await prisma.group.findUnique({
      where: { id: groupeIdInt },
      include: {
        membres: true
      }
    });

    if (!groupe) {
      return res.status(404).json({ error: 'Groupe non trouvé' });
    }

    // Si des participants spécifiques sont fournis, vérifier qu'ils sont membres du groupe
    let finalParticipantIds = participantIds;
    if (participantIds && Array.isArray(participantIds)) {
      const membreIds = groupe.membres.map(m => m.id);
      const invalidParticipants = participantIds.filter((id: number) => !membreIds.includes(id));
      
      if (invalidParticipants.length > 0) {
        return res.status(400).json({ 
          error: 'Certains participants ne sont pas membres du groupe' 
        });
      }
    } else {
      // Si aucun participant spécifié, ajouter tous les membres du groupe
      finalParticipantIds = groupe.membres.map(m => m.id);
    }

    // Créer la discussion
    const discussion = await prisma.filDiscussion.create({
      data: {
        titre: titre || null,
        groupeId: groupeIdInt,
        participants: {
          connect: finalParticipantIds.map((id: number) => ({ id }))
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        }
      }
    });

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Erreur lors de la création de la discussion de groupe:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la discussion de groupe' });
  }
}

/**
 * Mettre à jour une discussion (titre, ajouter/retirer des participants)
 */
export async function updateDiscussion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { titre, addParticipantIds, removeParticipantIds } = req.body;
    const discussionId = parseInt(id as string);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'ID discussion invalide' });
    }

    // Vérifier que la discussion existe
    const existingDiscussion = await prisma.filDiscussion.findUnique({
      where: { id: discussionId }
    });

    if (!existingDiscussion) {
      return res.status(404).json({ error: 'Discussion non trouvée' });
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (titre !== undefined) {
      updateData.titre = titre;
    }

    if (addParticipantIds && Array.isArray(addParticipantIds)) {
      updateData.participants = {
        connect: addParticipantIds.map((id: number) => ({ id }))
      };
    }

    if (removeParticipantIds && Array.isArray(removeParticipantIds)) {
      updateData.participants = {
        ...updateData.participants,
        disconnect: removeParticipantIds.map((id: number) => ({ id }))
      };
    }

    // Mettre à jour la discussion
    const updatedDiscussion = await prisma.filDiscussion.update({
      where: { id: discussionId },
      data: updateData,
      include: {
        participants: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        groupe: {
          select: {
            id: true,
            nom: true,
            description: true
          }
        }
      }
    });

    res.status(200).json(updatedDiscussion);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la discussion:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la discussion' });
  }
}

/**
 * Supprimer une discussion
 */
export async function deleteDiscussion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const discussionId = parseInt(id as string);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'ID discussion invalide' });
    }

    // Vérifier que la discussion existe
    const existingDiscussion = await prisma.filDiscussion.findUnique({
      where: { id: discussionId }
    });

    if (!existingDiscussion) {
      return res.status(404).json({ error: 'Discussion non trouvée' });
    }

    // Supprimer d'abord tous les messages de la discussion
    await prisma.message.deleteMany({
      where: { id_discussion: discussionId }
    });

    // Supprimer la discussion
    await prisma.filDiscussion.delete({
      where: { id: discussionId }
    });

    res.status(200).json({ message: 'Discussion supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la discussion:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la discussion' });
  }
}