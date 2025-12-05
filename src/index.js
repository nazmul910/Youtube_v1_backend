import express from 'express';
import dotenv from 'dotenv';

import connectDB from './db/index.js';


dotenv.config();


const app  = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;


app.get('/api/joke', (req, res) => {
    res.send('Hello, World!');
})



app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
})

