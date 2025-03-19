import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// Define routes
router.get('/', getUsers);
router.post('/', createUser);

export default router; // ✅ Make sure this line exists
