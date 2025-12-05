// controllers/blogController.js
import mongoose from 'mongoose';
import Blog from '../models/blogModel.js';

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Author comes from authenticated user (set by authMiddleware)
    const author = req.user.userId;

    const blog = await Blog.create({ title, content, author });

    // Populate author info when returning
    await blog.populate('author', 'username');

    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 }); // latest first
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit / update blog by id
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog id' });
    }

    // Find blog first to check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own blogs' });
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    ).populate('author', 'username');

    res.json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete blog by id
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog id' });
    }

    // Find blog first to check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own blogs' });
    }

    await Blog.findByIdAndDelete(id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
};
