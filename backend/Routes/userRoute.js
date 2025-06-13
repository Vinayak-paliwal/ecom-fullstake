import express from 'express'
import {getUser, login, signUp} from '../Controller/userController.js'
import VerifyToken from '../middleware/VerifyToken.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getAllUsers, blockUser } from '../Controller/userController.js';

const route = express.Router();

// Auth routes
route.post('/signup', signUp)
route.post('/login', login)

// Admin routes - need to come before /:id route
route.get('/users', getAllUsers);
route.put('/users/:userId/block', blockUser);

// User detail route - should come last
route.get('/:id', getUser)

export default route;