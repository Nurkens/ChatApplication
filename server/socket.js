import { Server } from "socket.io";

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`Client ${socket.id} joined room: ${roomId}`);
            socket.to(roomId).emit("userJoined", { userId: socket.id, roomId });
        });

        socket.on("sendMessage", (data) => {
            const { roomId, message } = data;
            io.to(roomId).emit("messageReceived", message);
            console.log(`Message sent to room ${roomId}: ${message}`);
        });

        socket.on("privateMessage", (data) => {
            const { receiverId, message } = data;
            io.to(receiverId).emit("privateMessageReceived", message);
            console.log(`Private message sent to ${receiverId}: ${message}`);
        });

        socket.on("leaveRoom", (roomId) => {
            socket.leave(roomId);
            console.log(`Client ${socket.id} left room: ${roomId}`);
            socket.to(roomId).emit("userLeft", { userId: socket.id, roomId });
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default setupSocket;
