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
            // "http://10.30.5.129:" + PORT_NUMBER,
            "http://10.30.5.129:2000",
            // "http://192.168.219.101:2000",
            "http://localhost:2000",
        ],
    }
});

io.on("connection", socket => {
    socket.on("join-room", () => {
        const userinfo = {
            sender: socket.id,
        }
        socket.broadcast.emit("join-someone", userinfo);
    })
    socket.on("offer", (payload) => {
        payload.reciever = socket.id;
        // console.log(payload);
        socket.broadcast.to(payload.sender).emit("offer", payload);
    })
    socket.on("answer", (desc) => {
        socket.broadcast.emit("answer", desc);
    })
    socket.on("newIceCandidate", candidate => {
        const payload = {
            candidate: candidate,
            sender: socket.id
        }
        console.log(payload);
        socket.broadcast.emit("newIceCandidate", payload);
    })
});

app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, "public/build")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

// io.listen(PORT_NUMBER);

server.listen(PORT_NUMBER, ()=>{
    console.log("Server is running on port : ", PORT_NUMBER);
})