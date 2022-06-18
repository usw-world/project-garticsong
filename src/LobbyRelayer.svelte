<script>
    import { io } from 'socket.io-client';
    import { onMount } from 'svelte';
    import { game, socket as mainSocket } from './store';
    import StartButton from './StartButton.svelte';
    export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    const iceConfiguration = {'iceServers': [
        {
            'urls':[
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stun.ekiga.net",
                "stun:stun.ideasip.com",
                "stun:stun.rixtelecom.se",
                "stun:stun.schlund.de",
                "stun:stun.stunprotocol.org:3478",
                "stun:stun.voiparound.com",
                "stun:stun.voipbuster.com",
                "stun:stun.voipstunt.com",
                "stun:stun.voxgratia.org",
                'turn:numb.viagenie.ca',
            ],
            username: 'webrtc@live.com',
            credential: 'muazkh',
        },
    ]};

    let peerConnections = [];
    let signalChannels = [];

    onMount(() => {
        let url = new URL(document.location.href);
        let param = url.searchParams.get("jr");
        if(!param) {// is host
            game.update(game => {
                return {
                    ...game,
                    isGuest : false,
                };
            });
            HostRoom();
        } else {
            JoinRoom(param);
        }
        socket.on("someone-enters", (updatedRoom, user) => {
            console.log("enter user id ", user.id);
            game.update(game => {
                return {
                    ...game,
                    room : {
                        ...thisGame.room,
                        users: [...thisGame.room.users, user],
                    }
                }
            })
            console.log(thisGame);
        });
        socket.on("someone-leaves", (userId) => {
            console.log(userId);
            props.RemoveUser(userId);
        });
        socket.on("host-leaves", () => {
            document.querySelector('.host-leaves-alert').style.display = "flex";
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        })
    })

    async function JoinRoom(param) {
        if(param) {
            socket.on("enter-room", (payload) => {
                if(payload.status === "SUCCESS") {
                    thisGame.room = payload.room;
                    game.update(game => {
                        return {
                            ...game,
                            room : payload.room
                        };
                    });
                    console.log(thisGame);
                    props.SetInviteLink(payload.room.roomId);
                }
                if(payload.status === "REJECT") {
                    switch(payload.message) {
                        case "reject : not exist room":
                            props.SetGameState(3)
                            break;
                        case "reject : the room is full":
                            props.SetGameState(4)
                            break;
                    }
                }
            })
            let payload = {
                parameter: param,
                userinfo: thisGame.player
            }
            socket.emit("join-room", payload);
        }
    }
    async function HostRoom() {
        // socket.on("join-someone", async (userinfo) => {
        //     const pc = new RTCPeerConnection(configuration);
        //     peerConnections.push(pc);
        //     pc.remoteSocketId = userinfo.guestSocketId;
        //     pc.ondatachannel = OnMessage;
        //     pc.onicecandidate = OnIceCandidate;
        //     socket.on("newIceCandidate", (payload) => {
        //         HandleNewCandidate(pc, payload);
        //     });

        //     let channel = await pc.createDataChannel('signal');
        //     channel.onopen = (e) => { console.log("Channel is Opened", e); }
        //     channel.onclose = (e) => { console.log("Channel is Closed", e); }
        //     signalChannels.push(channel);

        //     socket.on("answer", async (desc) => {
        //         pc.setRemoteDescription(desc);
        //         socket.off("answer");
        //     });

        //     const offer = await pc.createOffer();
        //     pc.setLocalDescription(offer);
        //     const payload = {
        //         offer : offer,
        //         guestSocketId: userinfo.guestSocketId
        //     }
        //     socket.emit("offer", payload);
        // })
        // socket.on("offer", async (payload) => {
        //     const pc = new RTCPeerConnection(configuration);
        //     peerConnections.push(pc);
        //     pc.remoteSocketId = payload.reciever;
        //     pc.ondatachannel = OnMessage;
        //     pc.onicecandidate = OnIceCandidate;
        //     socket.on("newIceCandidate", (payload) => {
        //         HandleNewCandidate(pc, payload);
        //     });
        //     pc.setRemoteDescription(payload.offer);

        //     let channel = await pc.createDataChannel('signal');
        //     channel.onopen = (e) => { console.log("Channel is Opened", e); }
        //     channel.onclose = (e) => { console.log("Channel is Closed", e); }
        //     signalChannels.push(channel);

        //     const answer = await pc.createAnswer();
        //     pc.setLocalDescription(answer);
        //     const answerInfo = {
        //         description: answer,
        //         reciever: payload.reciever
        //     }
        //     socket.emit("answer", answerInfo);
        // })
        socket.on("set-room", (nextRoom) => {
            console.log(thisGame.room);
            console.log(nextRoom);
            game.update(game => {
                return {
                    ...game,
                    room: {
                        ...thisGame.room,
                        ...nextRoom,
                    }
                }
            });
            props.SetInviteLink(thisGame.room.roomId);
        });
        let createRoomPayload = {
            hostInfo : thisGame.player
        };
        socket.emit("create-room", createRoomPayload);
    }
    function SendMessage(e) {
        signalChannels.forEach(channel => {
            channel.send(e.target.data.value);
        })
    }
    function HandleNewCandidate(pc, payload) {
        if(pc.remoteSocketId === payload.guestSocketId)
            pc.addIceCandidate(payload.candidate)
            .then(
                () => { /* console.log("Never mind I'll find someone like you."); */ },
                (error) => { console.error(error); }
            );
    }
    function OnMessage(e) {
        const channel = e.channel;
        channel.onmessage = (e) => {
            console.log("Received Message.", e.data);
        }
    }
    function OnIceCandidate(e) {
        if(e.candidate) socket.emit("newIceCandidate", e.candidate);
    }
    // alert of users are not enough to start >>
    let showingAlert = false;
    function OnClickStartButton() {
        if(thisGame.room.users.length < 2) {
            showingAlert = true;
        } else {
            // console.log(thisGame.room);
            socket.emit("game-start", thisGame.room);
        }
    }
</script>

<div class="button-area">
    <button class="start-button" on:click={OnClickStartButton}>
        {#if !thisGame.isGuest}
            <StartButton></StartButton>
        {/if}
    </button>
    <div class="alert-not-enough" style={`
        top: ${showingAlert ? "0" : "10rem"};
        opacity: ${showingAlert ? "1" : "0"};
    `}>
        <div class="alert-wrap" style="{`pointer-events: ${showingAlert ? "initial" : "none"};`}">
            <div class="alert-image-wrap">
                <img src="/images/not-enough.svg" alt="">
            </div>
            매우 안타까운 일이지만,<br>
            친구가 없으면 게임을 시작할 수 없어요...<br>
            <button class="acept-button" on:click={() => { showingAlert = false; }}>
                슬퍼요
            </button>
        </div>
    </div>
    <div class="host-leaves-alert">
        <div class="alert-box">
            호스트가 도망쳤어요!
        </div>
    </div>
</div>

<style>
    .host-leaves-alert {
        position: absolute;
        top: 0; left: 0;
        display: none;
        width: 100%;
        height: 100%;
        color: #232323;
        font-size: 2.2rem;
        font-weight: 900;
        z-index: 3;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        background-color: rgba(0, 0, 0, .5);
    }
    .alert-box {
        display: flex;
        width: 36rem;
        height: 12rem;
        background-color: #fff;
        border: .3rem solid #232323;
        border-radius: 2rem;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
    }
    .start-button {
        background: none;
        border: 0;
    }
    .button-area {
        margin-top: 5rem;
        width: 100%;
        text-align: center;
    }
    .alert-not-enough {
        transition: opacity 400ms ease,
                    top 400ms ease;
        position: fixed;
        top: 0; left: 0;
        display: flex;
        width: 100%;
        height: 100%;
        font-size: 1.9rem;
        font-weight: 700;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }
    .alert-wrap {
        width: 40%;
        padding: 2rem 2rem 4rem;
        background-color: #121212;
        background: linear-gradient(to right, #121212, #272727, #121212);
        pointer-events: initial;
        border: .5rem solid #fff;
        border-radius: 5rem;
        line-height: 1.45;
    }
    .acept-button {
        padding: 1.2rem 2.2rem 1rem;
        margin-top: 2rem;
        border-radius: 2.7rem;
        cursor: pointer;
    }
    .alert-image-wrap {
        padding: 4rem 15rem 6rem;
        box-sizing: border-box;
    }
</style>