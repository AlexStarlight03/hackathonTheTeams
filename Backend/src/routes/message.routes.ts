import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  newMessage,
  getMessagesByDiscussion,
  deleteMessage,
} from '../controllers/message.controller';

const router = Router();

router.post('/', authenticate, newMessage);
router.get('/:discussionId', authenticate, getMessagesByDiscussion);
router.delete('/:messageId', authenticate, deleteMessage);

export default router;


