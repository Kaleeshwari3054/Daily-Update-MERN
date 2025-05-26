import express from 'express';
import { 
  createUpdate, 
  getUpdates, 
  getUpdateById, 
  updateUpdate, 
  deleteUpdate,
  getUpdatesByDateRange
} from '../controllers/updateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createUpdate)
  .get(protect, getUpdates);

router.get('/range', protect, getUpdatesByDateRange);

router.route('/:id')
  .get(protect, getUpdateById)
  .put(protect, updateUpdate)
  .delete(protect, deleteUpdate);

export default router;