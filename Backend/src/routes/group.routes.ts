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

const router = Router();

router.post('/', createGroup);
router.post('/:groupId/join/:userId',joinGroup);
router.post('/:groupId/leave/:userId',leaveGroup);
router.post('/:groupId/addmod/:userId',addModerateur);
router.post('/:groupId/deletemod/:userId',deleteModerateur);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.patch('/:id/:userId', updateGroup);
router.delete('/:id/:userId', deleteGroup);
router.get('/:id/evenements', getEvenementsByGroupId);

export default router;
