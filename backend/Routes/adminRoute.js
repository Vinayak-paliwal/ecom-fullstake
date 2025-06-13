import express from 'express';
import { getAllUsers, getAllSellers, toggleUserBlock } from '../Controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all admin routes with authentication and admin check
router.use(authenticateToken, isAdmin);

// Get all users
router.get('/users', getAllUsers);

// Get all sellers
router.get('/sellers', getAllSellers);

// Toggle user block status
router.put('/users/:userId/toggle-block', toggleUserBlock);

export default router; 