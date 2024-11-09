import express from 'express';
import { insertDataFromJson } from '../services/databaseService.js';

const router = express.Router();

router.post('/insert-data', async (req, res) => {
  try {
    const { filePath } = req.body; 
    await insertDataFromJson(filePath);
    res.status(200).send('Veriler başarıyla eklendi');
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).send('Veri eklenirken bir hata oluştu');
  } 
});

export default router;
