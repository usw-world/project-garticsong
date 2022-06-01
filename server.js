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
            "http://125.190.241.9:2000",
            "http://10.30.5.129:2000",
            "http://192.168.219.101:2000",
            "http://localhost:2000",
        ],
    }
});

let guestBook = {};
let rooms = {};
let watingRooms = {};
let connectingRooms = {};
const RoomGenerator = (id, hostUser) => {
    let host = {
        id, 
        ...hostUser,
    };
    return {
        roomId : `room${id}`,
        host,
        users : [host],
    }
}

io.on("connection", socket => {
    socket.on("create-room", (payload) => {
        console.log("created room :\n ", payload);
        rooms[`room${socket.id}`] = RoomGenerator(socket.id, payload.hostInfo);
        socket.join(`room${socket.id}`);
        io.to(socket.id).emit("set-room", rooms[`room${socket.id}`]);
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
        if(rooms[`${requestPayload.parameter}`]) {
            if(rooms[`${requestPayload.parameter}`].users.length >= 6) {
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
                room : rooms[`${requestPayload.parameter}`],
            };
            io.to(socket.id).emit("enter-room", payload);
            socket.to(requestPayload.parameter).emit("someone-enters", rooms[`${requestPayload.parameter}`], enteredUser);
        } else { // not exist room : reject
            let payload = {
                status : "REJECT",
                message : "reject : not exist room"
            }
            io.to(socket.id).emit("enter-room", payload);
        }
    })
    socket.on("answer-to-sender", (answer, senderId) => {
        socket.to(senderId).emit("answer-to-sender", answer, socket.id);
    })
    socket.on("check-room", (roomId) => {
        io.to(socket.id).emit("result-check", !!rooms[`${roomId}`]);
    })
    socket.on("disconnect", () => {
        console.log("someone left the game");
        RemoveUser(guestBook[socket.id], socket.id);
        io.to(guestBook[socket.id]).emit("someone-leaves", socket.id);
    })
    socket.on("game-start", (room) => {
        watingRooms[room.roomId] = [...room.users];
        connectingRooms[room.roomId] = [...room.users];
        io.to(room.roomId).emit("game-start", room);
    })
    socket.on("ready-to-connect", (roomid) => {
        if(watingRooms[roomid]) {
            watingRooms[roomid] = watingRooms[roomid].filter(user => {
                return user.id !== socket.id;
            })
        }
        if(watingRooms[roomid].length<=0) {
            ConnectAsP2P(roomid)
        }
    })
    socket.on("offer-to-another", (offer, payload) => {
        io.to([payload.targetUser.id]).emit("offer-answer", offer, socket.id);
    })
    socket.on("successed-connecting-all", (room) => {
        connectingRooms[room.roomId] = connectingRooms[room.roomId].filter(user => {
            return user.id !== socket.id;
        })
        if(connectingRooms[room.roomId].length <= 0) {
            ReleaseRoom(room.roomId);
        }
    })
    const ReleaseRoom = (roomId) => {
        // console.log(rooms[roomId].users);
        rooms[roomId].users.forEach(user => {
            console.log(user.id);
            io.to(user.id).emit("ready-to-start");
            io.sockets.sockets.get(user.id).disconnect();
        })
        delete rooms[roomId];
    }
    const ConnectAsP2P = (roomid) => {
        let users = rooms[`${roomid}`].users;
        if(users.length<=1) return;

        for(let i=0; i<users.length; i++) {
            for(let j=i+1; j<users.length; j++) {
                const payload = {
                    targetUser : users[j]
                }
                io.to([users[i].id]).emit('offer-description', payload);
            }
        }
    }
    const PushUser = (roomId, userinfo, socketId) => {
        socket.join(`${roomId}`);
        let user = {
            id : socketId,
            ...userinfo,
        }
        guestBook[socketId] = roomId;
        rooms[`${roomId}`].users.push(user);
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