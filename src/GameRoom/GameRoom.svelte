<script>
    import UserInfo from '../UserInformation.svelte';
    import Questioner from './Questioner.svelte';
    import LoadingComponent from '../LoadingComponent.svelte';
    import AnswerRoom from './AnswerRoom.svelte'
    import { onMount } from 'svelte';
    import { game, socket as mainSocket } from '../store';
    // export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    let isLoaded = false;

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

    const PushPeerConnectionToArray = (pc, targetUserId) => {
        let nextPcs = thisGame.peerConnections;
        nextPcs[targetUserId] = pc;
        game.update(game => {
            return {
                ...game,
                peerConnections: nextPcs,
            }
        });
        console.log(thisGame);
    };
    const PushDataChannelToArray = (channel, targetUserId) => {
        let nextChannels = thisGame.signalChannels;
        nextChannels[targetUserId] = channel;
        game.update(game => {
            return {
                ...game,
                signalChannels : nextChannels
            }
        });
        console.log(thisGame);
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
            console.log("Message arrived", e.data);
        }
    }
    function OnIceCandidate(e) {
        if(e.candidate) socket.emit("newIceCandidate", e.candidate);
    }
    onMount(() => {
        game.update(game => {
            return {
                ...game,
                peerConnections : {},
                signalChannels : {},
            };
        });
        socket.on("offer-answer", async (offer, senderId) => { // remote-1
            let localPeerConnection =  new RTCPeerConnection(iceConfiguration);
            PushPeerConnectionToArray(localPeerConnection, senderId);
            localPeerConnection.onicecandidate = OnIceCandidate;
            localPeerConnection.ondatachannel = OnMessage;
            localPeerConnection.remoteSocketId = senderId;
            socket.on("newIceCandidate", (payload) => {
                HandleNewCandidate(localPeerConnection, payload);
            })

            let channel = await localPeerConnection.createDataChannel('signal');
            channel.onopen = (e) => { console.log("Channel is Opned", e) };
            channel.onclose = (e) => { console.log("Channel is Closed", e) };
            PushDataChannelToArray(channel, senderId);

            localPeerConnection.setRemoteDescription(offer);
            const answer = await localPeerConnection.createAnswer();
            localPeerConnection.setLocalDescription(answer);
            socket.emit("answer-to-sender", answer, senderId);
        })
        socket.on("answer-to-sender", async (answer, answererId) => { // local-2
            let peerConnection =  thisGame.peerConnections[answererId];
            console.log(peerConnection);
            peerConnection.remoteSocketId = answererId;
            if(peerConnection) {
                peerConnection.setRemoteDescription(answer);
            }
        })
        socket.on("offer-description", async (payload) => { // local-1
            let localPeerConnection =  new RTCPeerConnection(iceConfiguration);
            PushPeerConnectionToArray(localPeerConnection, payload.targetUser.id);
            localPeerConnection.onicecandidate = OnIceCandidate;
            localPeerConnection.ondatachannel = OnMessage;
            socket.on("newIceCandidate", (payload) => {
                HandleNewCandidate(localPeerConnection, payload);
            })

            let channel = await localPeerConnection.createDataChannel('signal');
            channel.onopen = (e) => { console.log("Channel is Opned", e) };
            channel.onclose = (e) => { console.log("Channel is Closed", e) };
            PushDataChannelToArray(channel, payload.targetUser.id);

            const offer = await localPeerConnection.createOffer();
            localPeerConnection.setLocalDescription(offer);
            socket.emit("offer-to-another", offer, payload)
        })
        socket.emit("ready-to-connect", thisGame.room.roomId);
    });

    let isCleared = false;
    let questionElmt;
    let answerObj;

    const OnFinishQuestion = (answer) => {
        answerObj = {...answer};
        setTimeout(() => {
            questionElmt.$destroy();
            isCleared = true;
        }, 400);
    }
</script>

<div class="room-wrap">
    <div class="room-left">
        <UserInfo users={thisGame.room.users}></UserInfo>
    </div>
    <div class="room-right">
        {#if !isLoaded}
            <LoadingComponent />
        {:else if !isCleared}
            <div class="box-wrapper">
                <Questioner bind:this={questionElmt} OnFinish={OnFinishQuestion}></Questioner>
            </div>
        {:else}
            <AnswerRoom answerObj={answerObj} />
        {/if}
    </div>
</div>

<style>
    .room-wrap {
        display: flex;
        max-width: 1200px;
        width: 100%;
        height: 70rem;
        margin: 0 auto;
        padding-top: 7rem;
        gap: 1rem;
        box-sizing: border-box;
    }
    .room-left,
    .room-right {
        height: 100%;
        box-sizing: border-box;
        border: 5px solid transparent;
    }
    .room-left {
        width: 22%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 0 10rem;
    }
    .room-right {
        width: 78%;
        height: 100%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 10rem 0;
    }
</style>