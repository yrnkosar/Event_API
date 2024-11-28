import express from 'express';
import cors from 'cors';
import databaseRouter from './src/routes/databaseRoutes.js'; 
import userRouter from './src/routes/userRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import participantRouter from './src/routes/participantRoutes.js';
import interestRoutes from './src/routes/interestRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import pointRoutes from './src/routes/pointRoutes.js';
import sequelize from './src/config/db.js';

const app = express();
app.use(cors());

sequelize.authenticate()
    .then(() => {
        console.log('Database connection successful.');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

app.use(express.json());

app.use('/api/database', databaseRouter);  
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/event', eventRouter);
app.use('/api/participant', participantRouter);
app.use('/api/interest', interestRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/point', pointRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 