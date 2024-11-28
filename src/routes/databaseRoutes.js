import express from 'express';
import { insertDataController } from '../controllers/databaseController.js';

const router = express.Router();

router.post('/insert-data', insertDataController);

export default router;
