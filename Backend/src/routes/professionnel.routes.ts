import { Router } from 'express';
import { authenticate, authorizedRoles, authorizedGroup } from '../middleware/auth.middleware';
import { getUserById, updateUser } from '../controllers/user.controller';

import {
  createProfessionnel,
  getAllProfessionnels,
  getProfessionnelById,
  updateProfessionnel,
  deleteProfessionnel,
  userProStatus
} from '../controllers/professionnel.controller';

const router = Router();

router.post('/professionnels', userProStatus(false), createProfessionnel);
router.get('/professionnels', getAllProfessionnels);
router.get('/professionnels/:id', getProfessionnelById);
router.put('/professionnels/:id', userProStatus(true), updateProfessionnel);
router.delete('/professionnels/:id', userProStatus(true), deleteProfessionnel);

export default router;