import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} from '../controllers/journal.controller';

const router = Router();


router.post('/journals', createJournalEntry);
router.get('/journals', getJournalEntries);
router.get('/journals/:id', getJournalEntryById);
router.put('/journals/:id', updateJournalEntry);
router.delete('/journals/:id', deleteJournalEntry);

export default router;