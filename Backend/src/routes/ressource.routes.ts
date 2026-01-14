import { Router } from 'express';
import {
    createRessource,
    deleteRessource,
    getAllRessources,
    getRessourceById,
    updateRessource 
}from '../controllers/ressource.controller';

const router = Router();

router.post('/ressources', createRessource);
router.get('/ressources', getAllRessources);
router.get('/ressources/:id', getRessourceById);
router.put('/ressources/:id', updateRessource);
router.delete('/ressources/:id', deleteRessource);

export default router;

