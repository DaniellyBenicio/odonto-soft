import express from 'express';
import { authenticate, authorize } from '../../middlewares/authMiddlware.js';
import { registerUser, updateUser, getUsers, getUserById, deleteUser} from '../../controllers/admin/userController.js';
const router = express.Router();

router.post('/users', authenticate, authorize('admin', 'atendente'), registerUser);
router.put('/users/:id', authenticate, authorize('admin', 'atendente'), updateUser);
router.get('/users', authenticate, authorize('admin', 'atendente', 'dentista'), getUsers);
router.get('/users/:id', authenticate, authorize('admin', 'atendente', 'dentista'), getUserById);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

export default router;
