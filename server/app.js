import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import socketIo from 'socket.io';
import router from './routes/authRoutes';
dotenv.config();

const PORT = process.env.PORT


const app = express();


const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)

})

const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use('/api',router);





mongoose.connect()