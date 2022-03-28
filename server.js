const path = require("path");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["http://10.30.5.129:2002"],
    }
});

io.on("connection", socket => {
    // console.log("someone join relay server, someone : ", socket);
    // io.emit("offer", {})
});
io.on("usoock", (socket) => {
    console.log('usoock is comming');
})

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