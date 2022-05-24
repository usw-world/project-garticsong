<script>
    import { io } from 'socket.io-client';
    import { onMount } from 'svelte';
    import { game, socket as mainSocket } from './store';
    import ReadyButton from './ReadyButton.svelte';
    export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    const configuration = {'iceServers': [
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

    let isHost = false;
    let peerConnections = [];
    let signalChannels = [];

    onMount(() => {
        let url = new URL(document.location.href);
        let param = url.searchParams.get("jr");
        if(!param) {// is host
            HostRoom();
        } else {
            JoinRoom(param);
        }
        socket.on("someone-enters", (user) => {
            console.log("enter user id ", user.id);
            props.AddUser(user.id, user.name, user.profilePicture);
        });
        socket.on("someone-leaves", (userId) => {
            props.RemoveUser(userId);
        })
    })

    async function JoinRoom(param) {
        if(param) {
            socket.on("enter-room", (payload) => {
                if(payload.status === "SUCCESS") {
                    thisGame.room = payload.room;
                    props.SetInviteLink(payload.room.roomId);
                    payload.room.users.forEach(user => {
                        props.AddUser(user.id, user.name, user.profilePicture);
                    })
                }
                if(payload.status === "REJECT") {
                    // window.location = "https://garticsong.herokuapp.com/";
                    window.location = "http://localhost:2000/";
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
        socket.on("set-room", (room) => {
            thisGame.room = room;
            room.users.forEach(user => {
                props.AddUser(user.id, user.name, user.profilePicture);
            })
            props.SetInviteLink(room.roomId);
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
</script>

<div class="button-area">
    <input type="checkbox" name="is-host" id="is-host" on:change="{(e) => { isHost = e.target.checked }}">
    <label for="is-host">I am a host</label>
    <button on:click="{() => {
        if(isHost) HostRoom();
        else HostRoom();
    }}">{#if isHost}HOST{:else}LINK{/if}</button>
    <form on:submit|preventDefault={SendMessage}>
        <input type="text" name="data">
        <input type="submit" value="submit">
    </form>
    <ReadyButton></ReadyButton>
</div>

<style>
    label {
        display: inline;
    }
</style>