import express from 'express';
import cookeParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    cradantials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookeParser());

export {app};



