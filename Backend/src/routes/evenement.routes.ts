import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { 
    createEvenement,
    getAllEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement,
    getEvenementsByGroupId
} from '../controllers/evenement.controller';

const router = Router();


router.post('/evenements/:userId', createEvenement);
router.get('/evenements', getAllEvenements);
router.get('/evenements/:id', getEvenementById);
router.get('/groups/:groupId/evenements', getEvenementsByGroupId);
router.patch('/evenements/:id/:userId', updateEvenement);
router.delete('/evenements/:id/:userId', deleteEvenement);

export default router;