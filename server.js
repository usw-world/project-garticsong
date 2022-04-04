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
            // "http://10.30.5.129:2000",
            "http://192.168.219.101:2000",
            "http://localhost:2000"
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
    socket.on("link", () => {
        socket.broadcast.emit("link");
    });
    socket.on("newIceCandidate", candidate => {
        if(candidate !== null)
            io.emit("newIceCandidate", candidate);
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