import { insertDataFromJson } from '../services/databaseService.js';

export const insertDataController = async (req, res) => {
  try {
    const { filePath } = req.body; 
    await insertDataFromJson(filePath);
    res.status(200).send('Data added successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while adding data');
  } 
};

