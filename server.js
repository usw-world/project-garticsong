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

let guestBook = {};
let rooms = {};
const RoomGenerator = (id, hostUser) => {
    let host = {
        id, 
        ...hostUser,
    };
    return {
        roomId : id,
        host,
        users : [host],
    }
}

io.on("connection", socket => {
    socket.on("create-room", (payload) => {
        console.log("created room :\n ", payload);
        rooms[socket.id] = RoomGenerator(socket.id, payload.hostInfo);
        socket.join(socket.id);
        
        // console.log("io rooms : ", io.rooms);
        // console.log("server rooms : ", rooms);;
        io.to(socket.id).emit("set-room", rooms[socket.id]);
        // const userinfo = {
        //     guestSocketId: socket.id,
        // }
        // socket.broadcast.emit("join-someone", userinfo);
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
    socket.on("join-room", (requestPayload) => {
        if(rooms[requestPayload.parameter]) {
            if(rooms[requestPayload.parameter].users.length >= 6) {
                let payload = {
                    status : "REJECT",
                    message : "reject : the room is full"
                }
                io.to(socket.id).emit("enter-room", payload);
            }
            let enteredUser = {
                ...requestPayload.userinfo,
                id : socket.id,
            }
            PushUser(requestPayload.parameter, requestPayload.userinfo, socket.id);
            let payload = {
                status : "SUCCESS",
                room : rooms[requestPayload.parameter],
            };
            io.to(socket.id).emit("enter-room", payload);
            socket.to(requestPayload.parameter).emit("someone-enters", rooms[requestPayload.parameter], enteredUser);
        } else { // not exist room : reject
            let payload = {
                status : "REJECT",
                message : "reject : not exist room"
            }
            io.to(socket.id).emit("enter-room", payload);
        }
    })
    socket.on("check-room", (roomId) => {
        io.to(socket.id).emit("result-check", !!rooms[roomId]);
    })
    socket.on("disconnect", () => {
        console.log("someone left the game");
        RemoveUser(guestBook[socket.id], socket.id);
        io.to(guestBook[socket.id]).emit("someone-leaves", socket.id);
    })
    let watingRooms = {};
    socket.on("game-start", (room) => {
        watingRooms[room.roomId] = [...room.users];
        console.log(watingRooms);
        io.to(room.roomId).emit("game-start", room);
    })
    socket.on("ready-to-connect", (roomid) => {
        let targetRoom = watingRooms[roomid];
        if(targetRoom) {
            targetRoom = targetRoom.filter(id => {
                return id !== socket.id;
            })
            console.log("::: user loaded");
        }
    })
    const PushUser = (roomId, userinfo, socketId) => {
        socket.join(roomId);
        let user = {
            ...userinfo,
            id : socketId,
        }
        guestBook[socketId] = roomId;
        rooms[roomId].users.push(user);
    }
    const RemoveUser = (targetRoomId, targetUserId) => {
        if(targetRoomId) {
            let nextRoom = {
                ...rooms[targetRoomId],
                users : rooms[targetRoomId].users.filter(user => {
                    return user.id !== targetUserId
                }),
            }
            if(nextRoom.users.length <= 0) {
                delete rooms[targetRoomId];
            } else {
                rooms[targetRoomId] = nextRoom;
            }
        }
    }
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