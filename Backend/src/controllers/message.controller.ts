import prisma from '../prisma/prisma';
import type { Request, Response } from "express";

/**
 * Créer un nouveau message dans une discussion
 */
export async function newMessage(req: Request, res: Response) {
  try {
    const { id_discussion, message, emmeteurId } = req.body;

    // Validation
    if (!id_discussion || !message || !emmeteurId) {
      return res.status(400).json({ 
        error: 'Les champs id_discussion, message et emmeteurId sont requis' 
      });
    }

    const discussionId = parseInt(id_discussion);
    const emetteurIdInt = parseInt(emmeteurId);

    if (isNaN(discussionId) || isNaN(emetteurIdInt)) {
      return res.status(400).json({ error: 'IDs invalides' });
    }

    // Vérifier que la discussion existe
    const discussion = await prisma.filDiscussion.findUnique({
      where: { id: discussionId },
      include: {
        participants: true
      }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée' });
    }

    // Vérifier que l'émetteur est participant de la discussion
    const isParticipant = discussion.participants.some(p => p.id === emetteurIdInt);
    if (!isParticipant) {
      return res.status(403).json({ 
        error: 'Vous devez être participant de la discussion pour envoyer un message' 
      });
    }

    // Créer le message
    const newMsg = await prisma.message.create({
      data: {
        id_discussion: discussionId,
        message: message,
        emmeteurId: emetteurIdInt,
        time: new Date()
      },
      include: {
        emmeteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        discussion: {
          select: {
            id: true,
            titre: true
          }
        }
      }
    });

    res.status(201).json(newMsg);
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
}

/**
 * Récupérer tous les messages d'une discussion
 */
export async function getMessagesByDiscussion(req: Request, res: Response) {
  try {
    const { discussionId } = req.params;
    const discussionIdInt = parseInt(discussionId as string);

    if (isNaN(discussionIdInt)) {
      return res.status(400).json({ error: 'ID discussion invalide' });
    }

    // Vérifier que la discussion existe
    const discussion = await prisma.filDiscussion.findUnique({
      where: { id: discussionIdInt }
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée' });
    }

    // Options de pagination (optionnelles)
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = (page - 1) * limit;

    // Récupérer les messages
    const messages = await prisma.message.findMany({
      where: {
        id_discussion: discussionIdInt
      },
      include: {
        emmeteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      },
      orderBy: {
        time: 'asc' // Du plus ancien au plus récent
      },
      skip: skip,
      take: limit
    });

    // Compter le total de messages
    const totalMessages = await prisma.message.count({
      where: {
        id_discussion: discussionIdInt
      }
    });

    res.status(200).json({
      messages,
      pagination: {
        page,
        limit,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
}

/**
 * Supprimer un message
 */
export async function deleteMessage(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    const messageIdInt = parseInt(messageId as string);

    if (isNaN(messageIdInt)) {
      return res.status(400).json({ error: 'ID message invalide' });
    }

    // Vérifier que le message existe
    const message = await prisma.message.findUnique({
      where: { id: messageIdInt }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    // Supprimer le message
    await prisma.message.delete({
      where: { id: messageIdInt }
    });

    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
}

  