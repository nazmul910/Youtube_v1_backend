import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async() =>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongodb connected: ${connect.connection.host}`);
    } catch (error) {
        console.error('Mongodb connection error:', error);
        process.exit(1);
    }
}

connectDB();

export default connectDB;