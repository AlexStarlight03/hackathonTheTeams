import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup
} from '../controllers/group.controller';

const router = Router();

router.post('/group', createGroup);
router.get('/group', getGroups);
router.get('/group/:id', getGroupById);
router.put('/group/:id', updateGroup);
router.delete('/group/:id', deleteGroup);

export default router;
