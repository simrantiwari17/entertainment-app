import express from 'express';
import authenticate from '../middleware/auth.js';
import { addRecent, getRecent } from '../controllers/recentController.js';

const router = express.Router();

router.use(authenticate);
router.post('/', addRecent);
router.get('/', getRecent);

export default router;
