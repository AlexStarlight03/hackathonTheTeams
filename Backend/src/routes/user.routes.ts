import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';


import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id' , authenticate, getUserById);
router.post('/' , createUser);
router.put('/:id' , authenticate, updateUser);
router.delete('/:id' , authenticate, deleteUser);

export default router;
