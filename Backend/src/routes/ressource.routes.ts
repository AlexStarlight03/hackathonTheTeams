import { Router } from 'express';
import { authenticate } from "../middleware/auth.middleware";
import {
    createRessource,
    deleteRessource,
    getAllRessources,
    getRessourceById,
    updateRessource 
}from '../controllers/ressource.controller';

const router = Router();

router.post('/:userId', authenticate, createRessource);
router.get('/', getAllRessources);
router.get('/:id', getRessourceById);
router.patch('/:id/:userId', authenticate, updateRessource);
router.delete('/:id/:userId', authenticate, deleteRessource);

export default router;

