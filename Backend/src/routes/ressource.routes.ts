import { Router } from 'express';
import {
    createRessource,
    deleteRessource,
    getAllRessources,
    getRessourceById,
    updateRessource 
}from '../controllers/ressource.controller';

const router = Router();

router.post('/:userId', createRessource);
router.get('/', getAllRessources);
router.get('/:id', getRessourceById);
router.put('/:id/:userId', updateRessource);
router.delete('/:id/:userId', deleteRessource);

export default router;

