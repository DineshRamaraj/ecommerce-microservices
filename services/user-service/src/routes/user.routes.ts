import express, { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router : Router = express.Router();

// PUBLIC ROUTES
router.post('/register', userController.register);
router.post('/login', userController.login);

// PROTECTED ROUTES
router.use(authenticate);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateBasicProfile);
router.post('/change-password', userController.changePassword);
router.post('/logout', userController.logout);

// ADMIN ROUTES
router.get('/', authorize('admin'), userController.getAllUsers);

export default router;
