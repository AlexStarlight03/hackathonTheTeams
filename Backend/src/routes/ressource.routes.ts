import { Router } from 'express';
import {
    createRessource,
    deleteRessource,
    getAllRessources,
    getRessourceById,
    updateRessource 
}from '../controllers/ressource.controller';

const router = Router();

router.post('/ressources/:userId', createRessource);
router.get('/ressources', getAllRessources);
router.get('/ressources/:id', getRessourceById);
router.put('/ressources/:id/:userId', updateRessource);
router.delete('/ressources/:id/:userId', deleteRessource);

export default router;

