import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { 
    getAllDiscussion,
    getDiscussionByUserId,
    getDiscussionByGroupId,
    postNewPrivateDiscussion,
    postNewGroupDiscussion,
    updateDiscussion,
    deleteDiscussion
} from '../controllers/discussion.controller';

const router = Router();

router.get('/discussions', getAllDiscussion);
router.get('/discussions/user/:userId', getDiscussionByUserId);
router.get('/discussions/group/:groupId', getDiscussionByGroupId);
router.post('/discussions/private', postNewPrivateDiscussion);
router.post('/discussions/group', postNewGroupDiscussion);
router.put('/discussions/:id', updateDiscussion);
router.delete('/discussions/:id', deleteDiscussion);

export default router;