import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5500", 
        methods: ["GET", "POST"],
    },
});

app.use(cors({
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
}));

io.on("connection", (socket) => {
    console.log("A user Connected: ", socket.id);

    socket.on("offer", (offer) => {
        socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
        socket.broadcast.emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate) => {
        socket.broadcast.emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Signaling server is running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    console.error("Server error:", err);
});

app.get('/', (rea, res) => {
    res.send("Hello")
})