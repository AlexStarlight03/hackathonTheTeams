import { Router } from 'express';
import { 
    createEvenement,
    getAllEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement,
    getEvenementsByGroupId
} from '../controllers/evenement.controller';

const router = Router();


router.post('/:userId', createEvenement);
router.get('/', getAllEvenements);
router.get('/:id', getEvenementById);
router.get('/:groupId/evenements', getEvenementsByGroupId);
router.patch('/:id/:userId', updateEvenement);
router.delete('/:id/:userId', deleteEvenement);

export default router;