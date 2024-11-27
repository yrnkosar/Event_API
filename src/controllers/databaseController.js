import express from 'express';
import { insertDataFromJson } from '../services/databaseService.js';

const router = express.Router();

router.post('/insert-data', async (req, res) => {
  try {
    const { filePath } = req.body; 
    await insertDataFromJson(filePath);
    res.status(200).send('Data added successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while adding data');
  } 
});

export default router;
