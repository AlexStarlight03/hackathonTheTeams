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

const router = Router();

router.get('/', getAllDiscussion);
router.get('/user/:userId', getDiscussionByUserId);
router.get('/group/:groupId', getDiscussionByGroupId);
router.post('/private', postNewPrivateDiscussion);
router.post('/group', postNewGroupDiscussion);
router.put('/:id', updateDiscussion);
router.get('/:id', getDiscussionById);
router.delete('/:id', deleteDiscussion);

export default router;