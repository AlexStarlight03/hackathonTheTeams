import { Router } from 'express';
import { 
    createEvenement,
    getAllEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement,
    getEvenementsByGroupId
} from '../controllers/evenement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


router.post('/:userId', authenticate, createEvenement);
router.get('/', getAllEvenements);
router.get('/:id', getEvenementById);
router.get('/:groupId/evenements', getEvenementsByGroupId);
router.patch('/:id/:userId', authenticate, updateEvenement);
router.delete('/:id/:userId', authenticate, deleteEvenement);

export default router;