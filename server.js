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
            "http://192.168.219.101:" + PORT_NUMBER,
        ],
    }
});

io.on("connection", socket => {
    socket.on("offer", payload => {
        console.log("payload :: ", payload.offer);
        io.emit("offer", payload.offer);
    })
    socket.on("answer", payload => {
        console.log("payload :: ", payload);
        socket.broadcast.emit("answer", payload);
    })
    socket.on("newIcecandidate", payload => {
        io.emit("iceCandidate", payload);
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