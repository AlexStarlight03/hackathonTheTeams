import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { getUserById, updateUser } from '../controllers/user.controller';

import {
  createProfessionnel,
  getAllProfessionnels,
  getProfessionnelById,
  updateProfessionnel,
  deleteProfessionnel,
  userProStatu,
} from '../controllers/professionnel.controller';

const router = Router();

router.post('/professionnels', userProStatu(false), createProfessionnel);
router.get('/professionnels', getAllProfessionnels);
router.get('/professionnels/:id', getProfessionnelById);
router.put('/professionnels/:id', userProStatu(true), updateProfessionnel);
router.delete('/professionnels/:id', userProStatu(true), deleteProfessionnel);

export default router;