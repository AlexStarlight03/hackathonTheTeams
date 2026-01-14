import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { 
    createEvenement,
    getAllEvenements,
    getEvenementById,
    updateEvenement,
    deleteEvenement 
} from '../controllers/evenement.controller';

const router = Router();


router.post('/evenements', createEvenement);
router.get('/evenements', getAllEvenements);
router.get('/evenements/:id', getEvenementById);
router.put('/evenements/:id', updateEvenement);
router.delete('/evenements/:id', deleteEvenement);

export default router;