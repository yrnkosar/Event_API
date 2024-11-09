import express from 'express';
import databaseController from '../controllers/databaseController.js';

const router = express.Router();

router.post('/insert-data', databaseController);

export default router;
