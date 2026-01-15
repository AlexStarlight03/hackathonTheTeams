import prisma from '../prisma/prisma';
import type { Request, Response } from "express";


export async function  createJournalEntry (req: Request, res: Response) {
    try {
        const {
            userId: _userId,
            user_id,
            date,
            humeur,
            energie,
            sommeil,
            anxiete,
            journal,
            modification,
        } = req.body;

        const userId = _userId ?? user_id;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const toScore = (v: any): number | undefined => {
            if (v === undefined || v === null) return undefined;
            const n = Number(v);
            if (!Number.isFinite(n)) return undefined;
            return Math.max(0, Math.min(10, Math.round(n)));
        };

        const humeurVal = toScore(humeur);
        const energieVal = toScore(energie);
        const sommeilVal = toScore(sommeil);
        const anxieteVal = toScore(anxiete);

        if ([humeurVal, energieVal, sommeilVal, anxieteVal].some((s) => s === undefined)) {
            return res
                .status(400)
                .json({ error: 'mood, energy, sleep and anxiety must be numbers between 0 and 10' });
        }

        const entry = await prisma.journalEntry.create({
            data: {
                userId,
                date: date ? new Date(date) : new Date(),
                humeur: humeurVal!,
                energie: energieVal!,
                sommeil: sommeilVal!,
                anxiete: anxieteVal!,
                journal: typeof journal === 'string' ? journal : '',
                modification: typeof modification === 'boolean' ? modification : true,
            } as any,
        });

        return res.status(201).json(entry);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function  getJournalEntries (req: Request, res: Response) {
    try {
        const {
            userId: _userIdFromQuery,
        } = req.query as any;
        const {
            userId: _userIdFromParams,
        } = req.params as any;
        const {
            userId: _userIdFromBody,
        } = req.body as any;

        const userId =
            _userIdFromParams ??
            _userIdFromQuery ??
            _userIdFromBody;


        if (!userId) return res.status(400).json({ error: "Utilisateur est requis" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "'Utilisateur non trouvé'" });

        const entries = await prisma.journalEntry.findMany({
            where: { userId },
            select: {
                id: true,
                userId: true,
                date: true,
                humeur: true,
                energie: true,
                sommeil: true,
                anxiete: true,
                journal: true,
            },
            orderBy: { date: 'desc' },
        });

        return res.status(200).json({success: true, data: entries});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function  getJournalEntryById (req: Request, res: Response) {
    try {
        const params = req.params as any;
        const query = req.query as any;
        const body = req.body as any;

        const userId =
            params.userId ??
            query.userId ??
            body.userId;

        const journalId =
            params.journalId ??
            params.id ??
            query.journalId ??
            query.id ??
            body.journalId ??
            body.id;

        if (!userId) return res.status(400).json({ error: "Utilisateur est requis" });
        if (!journalId) return res.status(400).json({ error: "Id du journal est requis" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "'Utilisateur non trouvé'" });

        const entry = await prisma.journalEntry.findUnique({
            where: { id: journalId },
            select: {
                id: true,
                userId: true,
                date: true,
                humeur: true,
                energie: true,
                sommeil: true,
                anxiete: true,
                journal: true,
            },
        });

        if (!entry || entry.userId !== userId) {
            return res.status(404).json({ error: "'Entrée du journal non trouvée'" });
        }

        return res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}


export async function  updateJournalEntry (req: Request, res: Response) {
    try {
        const params = req.params as any;
        const query = req.query as any;
        const body = req.body as any;

        const userId =
            params.userId ??
            query.userId ??
            body.userId;

        const journalId =
            params.journalId ??
            params.id ??
            query.journalId ??
            query.id ??
            body.journalId ??
            body.id;

        if (!userId) return res.status(400).json({ error: "Utilisateur est requis" });
        if (!journalId) return res.status(400).json({ error: "Id du journal est requis" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const entry = await prisma.journalEntry.findUnique({ where: { id: journalId } });
        if (!entry || entry.userId !== userId) {
            return res.status(404).json({ error: "Entrée du journal non trouvée" });
        }

        // Compare date (date-only)
        const entryDate = entry.date ? new Date(entry.date) : null;
        const today = new Date();
        const sameDay = entryDate && entryDate.toDateString() === today.toDateString();

        if (!sameDay) {
            // lock modifications
            if (entry.modification !== false) {
                await prisma.journalEntry.update({
                    where: { id: journalId },
                    data: { modification: false },
                });
            }
            return res.status(400).json({ error: "La date de l'entrée est dépassée pour modification" });
        }

        if (entry.modification === false) {
            return res.status(403).json({ error: "Modifications interdites pour cette entrée" });
        }

        const {
            humeur,
            energie,
            sommeil,
            anxiete,
            journal,
        } = body;

        const toScore = (v: any): number | undefined => {
            if (v === undefined || v === null) return undefined;
            const n = Number(v);
            if (!Number.isFinite(n)) return undefined;
            return Math.max(0, Math.min(10, Math.round(n)));
        };

        const humeurVal = toScore(humeur);
        const energieVal = toScore(energie);
        const sommeilVal = toScore(sommeil);
        const anxieteVal = toScore(anxiete);

        // Validate provided numeric fields
        const providedNumeric = [humeur, energie, sommeil, anxiete].some((v) => v !== undefined);
        if (
            (humeur !== undefined && humeurVal === undefined) ||
            (energie !== undefined && energieVal === undefined) ||
            (sommeil !== undefined && sommeilVal === undefined) ||
            (anxiete !== undefined && anxieteVal === undefined)
        ) {
            return res.status(400).json({ error: "Les champs humeur/energie/sommeil/anxiete doivent être des nombres entre 0 et 10" });
        }

        const data: any = {};
        if (humeurVal !== undefined) data.humeur = humeurVal;
        if (energieVal !== undefined) data.energie = energieVal;
        if (sommeilVal !== undefined) data.sommeil = sommeilVal;
        if (anxieteVal !== undefined) data.anxiete = anxieteVal;
        if (journal !== undefined) data.journal = typeof journal === 'string' ? journal : '';

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: "Aucun champ à mettre à jour fourni" });
        }

        const updated = await prisma.journalEntry.update({
            where: { id: journalId },
            data,
            select: {
                id: true,
                userId: true,
                date: true,
                humeur: true,
                energie: true,
                sommeil: true,
                anxiete: true,
                journal: true,
                modification: true,
            },
        });

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}


export async function deleteJournalEntry(req: Request, res: Response) {
    try {
        const params = req.params as any;
        const query = req.query as any;
        const body = req.body as any;

        const userId =
            params.userId ??
            query.userId ??
            body.userId;

        const journalId =
            params.journalId ??
            params.id ??
            query.journalId ??
            query.id ??
            body.journalId ??
            body.id;

        if (!userId) return res.status(400).json({ error: "Utilisateur est requis" });
        if (!journalId) return res.status(400).json({ error: "Id du journal est requis" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const entry = await prisma.journalEntry.findUnique({ where: { id: journalId } });
        if (!entry || entry.userId !== userId) {
            return res.status(404).json({ error: "Entrée du journal non trouvée" });
        }

        // Compare date (date-only)
        const entryDate = entry.date ? new Date(entry.date) : null;
        const today = new Date();
        const sameDay = entryDate && entryDate.toDateString() === today.toDateString();

        if (!sameDay) {
            // lock modifications
            if (entry.modification !== false) {
                await prisma.journalEntry.update({
                    where: { id: journalId },
                    data: { modification: false },
                });
            }
            return res.status(400).json({ error: "La date de l'entrée est dépassée pour suppression" });
        }

        if (entry.modification === false) {
            return res.status(403).json({ error: "Suppression interdite pour cette entrée" });
        }

        const deleted = await prisma.journalEntry.delete({
            where: { id: journalId },
            select: {
                id: true,
                userId: true,
                date: true,
                humeur: true,
                energie: true,
                sommeil: true,
                anxiete: true,
                journal: true,
            },
        });

        return res.status(200).json({ success: true, data: deleted });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}
