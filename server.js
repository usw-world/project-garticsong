const path = require("path");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: [
            "http://10.30.5.129:2002",
            "http://10.30.5.129:2023",
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

io.listen(3000);

app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, "public/build")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

server.listen(2002, ()=>{
    console.log("Server is running on port : 2002");
})