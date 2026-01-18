import { Router } from 'express';
import { 
    getAllDiscussion,
    getDiscussionByUserId,
    getDiscussionByGroupId,
    postNewPrivateDiscussion,
    postNewGroupDiscussion,
    updateDiscussion,
    deleteDiscussion,
    getDiscussionById
} from '../controllers/discussion.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllDiscussion);
router.get('/:userId', authenticate, getDiscussionByUserId);
router.get('/group/:groupId', getDiscussionByGroupId);
router.post('/private', authenticate, postNewPrivateDiscussion);
router.post('/group/:groupId', authenticate, postNewGroupDiscussion);
router.patch('/:id', authenticate, updateDiscussion);
router.get('/:id', getDiscussionById);
router.delete('/:id', authenticate, deleteDiscussion);

export default router;