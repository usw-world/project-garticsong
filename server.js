const path = require("path");
const PORT_NUMBER = process.env.PORT || 2023;

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: [
            "http://10.30.5.129:2000",
            "http://192.168.219.101:2000",
            "http://localhost:2000",
        ],
    }
});

io.on("connection", socket => {
    socket.on("join-room", () => {
        const userinfo = {
            guestSocketId: socket.id,
        }
        socket.broadcast.emit("join-someone", userinfo);
    })
    socket.on("offer", (payload) => {
        payload.reciever = socket.id;
        socket.broadcast.to(payload.guestSocketId).emit("offer", payload);
    })
    socket.on("answer", (payload) => {
        socket.broadcast.to(payload.reciever).emit("answer", payload.description);
    })
    socket.on("newIceCandidate", candidate => {
        const payload = {
            candidate: candidate,
            guestSocketId: socket.id
        }
        socket.broadcast.emit("newIceCandidate", payload);
    })
});

app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, "public/build")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

server.listen(PORT_NUMBER, ()=>{
    console.log("Server is running on port : ", PORT_NUMBER);
})