import { Router } from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} from '../controllers/journal.controller';
import { authenticate } from "../middleware/auth.middleware";

const router = Router();


router.post('/:id', authenticate, createJournalEntry);
router.get('/:userId', authenticate, getJournalEntries);
router.get('/:userId/:id', authenticate, getJournalEntryById);
router.patch('/:userId/:id', authenticate, updateJournalEntry);
router.delete('/:userId/:id', authenticate, deleteJournalEntry);

export default router;