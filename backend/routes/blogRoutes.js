// routes/blogRoutes.js
import express from 'express';
const router = express.Router();
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Get all blogs (public - no auth required)
router.get('/', authenticateToken,getAllBlogs);

// Create blog (protected - requires authentication)
router.post('/', authenticateToken, createBlog);

// Edit / update blog (protected - requires authentication)
router.put('/:id', authenticateToken, updateBlog);

// Delete blog (protected - requires authentication)
router.delete('/:id', authenticateToken, deleteBlog);

export default router;