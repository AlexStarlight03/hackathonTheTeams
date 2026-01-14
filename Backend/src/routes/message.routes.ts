import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  newMessage,
  getMessagesByDiscussion,
  deleteMessage,
} from '../controllers/message.controller';

const router = Router();

router.post('/messages', authenticate, newMessage);
router.get('/messages/:discussionId', authenticate, getMessagesByDiscussion);
router.delete('/messages/:messageId', authenticate, deleteMessage);

export default router;


