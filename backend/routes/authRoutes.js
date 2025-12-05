// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { signup, login, verify } from '../controllers/authcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Sign up route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Verify token route (protected - requires authentication)
router.get('/verify', authenticateToken, verify);

export default router;

