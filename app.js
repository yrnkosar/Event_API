// app.js
import express from 'express';
import databaseRouter from './src/routes/databaseRouter.js'; 
import userRouter from './src/routes/userRoutes.js';
import adminRouter from './src/routes/adminRoutes.js'
import sequelize from './src/config/db.js';

const app = express();

sequelize.authenticate()
    .then(() => {
        console.log('Veritabanı bağlantısı başarılı.');
    })
    .catch(err => {
        console.error('Veritabanı bağlantısı hatası:', err);
    });

app.use(express.json());

app.use('/api/database', databaseRouter);  
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 