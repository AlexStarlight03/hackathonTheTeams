import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  addModerateur,
  deleteModerateur
} from '../controllers/group.controller';
import { getEvenementsByGroupId } from '../controllers/evenement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createGroup);
router.post('/:groupId/join/:userId', authenticate, joinGroup);
router.post('/:groupId/leave/:userId',authenticate, leaveGroup);
router.post('/:groupId/addmod/:userId', authenticate, addModerateur);
router.post('/:groupId/deletemod/:userId',authenticate, deleteModerateur);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.patch('/:id/:userId', authenticate, updateGroup);
router.delete('/:id/:userId', authenticate, deleteGroup);
router.get('/:id/evenements', getEvenementsByGroupId);

export default router;
