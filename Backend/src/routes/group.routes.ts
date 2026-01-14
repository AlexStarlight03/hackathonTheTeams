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

const router = Router();

router.post('/group', createGroup);
router.post('/:groupId/join/:userId',joinGroup);
router.post('/:groupId/leave/:userId',leaveGroup);
router.post('/:groupId/addmod/:userId',addModerateur);
router.post('/:groupId/deletemod/:userId',deleteModerateur);
router.get('/group', getGroups);
router.get('/group/:id', getGroupById);
router.patch('/group/:id/:userId', updateGroup);
router.delete('/group/:id/:userId', deleteGroup);

export default router;
