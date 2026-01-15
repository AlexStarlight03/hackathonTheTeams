import { Router } from 'express';

import {
  createProfessionnel,
  getAllProfessionnels,
  getProfessionnelById,
  updateProfessionnel,
  deleteProfessionnel,
} from '../controllers/professionnel.controller';

const router = Router();

router.post('/:id', createProfessionnel);
router.get('/', getAllProfessionnels);
router.get('/:id', getProfessionnelById);
router.patch('/:id', updateProfessionnel);
router.delete('/:id', deleteProfessionnel);

export default router;