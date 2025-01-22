import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server as SocketIO } from 'socket.io';
import router from './routes/authRoutes.js'; 
import routerRoom from './routes/roomRoutes.js';
import routerMessage from './routes/messageRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new SocketIO(server);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/api/auth', router); 
app.use('/api/room', routerRoom); 
app.use('/api/message', routerMessage); 

app.set("socketIO", io);

mongoose.connect(process.env.MONGO_URL, {
    
    
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((e) => {
    console.log(e);
});
