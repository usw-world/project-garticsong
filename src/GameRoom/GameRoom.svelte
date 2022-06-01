<script>
    import UserInfo from '../UserInformation.svelte';
    import Questioner from './Questioner.svelte';
    import LoadingComponent from '../LoadingComponent.svelte';
    import QuestionUserInterface from './QuestionUserInterface.svelte';
    import AnswerForm from './AnswerForm.svelte'
    import { onMount } from 'svelte';
    import { game, socket as mainSocket } from '../store';
    // export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    let isLoaded = false;
    let isPlaying = false;
    let currectAnswerer = null;
    let readiedUsers = [];
    let bringers = [];

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
    const PushUserToConnectedUsers = (user) => {
        game.update(game => {
            return {
                ...game,
                connectedUsers : [...thisGame.connectedUsers, user],
            }
        })
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
    function OnIceCandidate(e) {
        if(e.candidate) socket.emit("newIceCandidate", e.candidate);
    }
    function OnMessage(e) {
        const channel = e.channel;
        channel.onmessage = (e) => {
            const data = JSON.parse(e.data);
            MessageEventHandler(data);
        }
    }
    const MessageEventHandler = (eventData) => {
        switch(eventData.type) {
            case "connect":
                PushUserToConnectedUsers(eventData.sender);
                let uncheckedUsers = [...thisGame.room.users];
                thisGame.connectedUsers.forEach(user => {
                    let sender = uncheckedUsers.find(item => item.id === user.id);
                    if(sender) {
                        uncheckedUsers = uncheckedUsers.filter(item => item.id !== sender.id);
                    } else {
                        console.error("not exist user was connected! what the heck!");
                        return;
                    }
                    if(uncheckedUsers.length === 1 && uncheckedUsers[0].id === thisGame.player.id) {
                        socket.emit("successed-connecting-all", thisGame.room);
                    }
                })
                break;
            case "readied-to-question":
                UserIsReady(eventData.sender.id);
                break;
            case "set-question":
                ReadyToAnswer(eventData.question);
                break;
            case "make-questioner":
                bringers = [...thisGame.room.users];
                const data = {
                    type: "set-question",
                    question: {
                        ...localQuestion,
                        author: thisGame.player,
                    },
                }
                SendMessageAll(data, true);
                break;
            case "readied-to-play-music":
                bringers = bringers.filter(bringer => {
                    bringer.id !== eventData.sender;
                });
                if(bringers.length <= 0) {
                    const data = {
                        type: "start-round",
                    }
                    SendMessageAll(data, true);
                }
                break;
            case "start-round":
                currectAnswerer = eventData.answerer;
                game.update(game => {
                    return {
                        ...game,
                        room: {
                            ...thisGame.room,
                            roundStarted: true,
                        }
                    }
                })
                StartRound();
                break;
            case "submit-answer":
                const result = CheckAnswer(eventData.title);
                if(result) {
                    SendMessageAll({
                        type: "someone-guessed",
                        answerer: eventData.sender,
                    }, true)
                }
                break;
            case "someone-guessed":
                currectAnswerer = eventData.answerer;
                console.log(currectAnswerer);
                break;
        }
    }
    function CheckAnswer(title) {
        if(title === thisGame.room.currentQuestion.title)
            return true;
        else
            return false;
    }
    function OnOpenChannel(e) {
        console.log("Channel is Opened ", e);
        e.currentTarget.send(JSON.stringify({
            sender : thisGame.player,
            type : "connect"
        }));
    }
    onMount(() => {
        game.update(game => {
            return {
                ...game,
                peerConnections : {},
                signalChannels : {},
                connectedUsers : []
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
            channel.onopen = OnOpenChannel;
            channel.onclose = (e) => { console.log("Channel is Closed", e) };
            PushDataChannelToArray(channel, senderId);

            localPeerConnection.setRemoteDescription(offer);
            const answer = await localPeerConnection.createAnswer();
            localPeerConnection.setLocalDescription(answer);
            socket.emit("answer-to-sender", answer, senderId);
        })
        socket.on("answer-to-sender", async (answer, answererId) => { // local-2
            let peerConnection =  thisGame.peerConnections[answererId];
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
            channel.onopen = OnOpenChannel;
            channel.onclose = (e) => { console.log("Channel is Closed", e) };
            PushDataChannelToArray(channel, payload.targetUser.id);

            const offer = await localPeerConnection.createOffer();
            localPeerConnection.setLocalDescription(offer);
            socket.emit("offer-to-another", offer, payload)
        })
        socket.on("ready-to-start", () => {
            isLoaded = true;
        })
        socket.emit("ready-to-connect", thisGame.room.roomId);
    });

    let questionWasWroten = false;
    let localQuestion;

    const OnFinishQuestion = (questionInfo) => {
        isLoaded = false;
        localQuestion = {...questionInfo};
        game.update(game => {
            return {
                ...game,
                myQuestion: questionInfo,
            }
        });
        setTimeout(() => {
            questionWasWroten = true;
        }, 400);
        
        if(thisGame.isGuest) { // guest case
            const hostId = thisGame.room.host.id;
            let data = {
                sender: thisGame.player,
                type: "readied-to-question",
            }
            thisGame.signalChannels[hostId].send(JSON.stringify(data));
        } else { // host case
            UserIsReady(thisGame.player.id)
        }
    }
    function UserIsReady(userId) {
        readiedUsers.push(userId);
        let remainingUsersNumber = thisGame.room.users.filter(user => {
            return readiedUsers.indexOf(user.id) < 0;
        }).length;
        if(remainingUsersNumber<=0) {
            const data = {
                type: "make-questioner"
            }
            SendMessage(data, readiedUsers.shift());
        }
    }
    function SendMessage(data, targetUserId) {
        data = {
            ...data,
            sender: thisGame.player,
        };
        if(thisGame.player.id !== targetUserId && thisGame.signalChannels[targetUserId])
            thisGame.signalChannels[targetUserId].send(JSON.stringify(data));
        else 
            MessageEventHandler(data);
    }
    function SendMessageAll(data, sendSelf) {
        data = {
            ...data,
            sender: thisGame.player,
        };
        thisGame.room.users.forEach(user => {
            if(thisGame.player.id !== user.id)
                thisGame.signalChannels[user.id].send(JSON.stringify(data));
            else 
                if(sendSelf)
                    MessageEventHandler(data);
        })
    }
    function ReadyToAnswer(question) {
        game.update(game => {
            return {
                ...game,
                room: {
                    ...thisGame.room,
                    currentQuestion: question,
                }
            }
        });
        setTimeout(() => {
            isLoaded = true;
            isPlaying = true;
        }, 400);
    }
    function OnReadyToPlayMusic(e) {
        const data = {
            type: "readied-to-play-music",
        }
        console.log(e);
        SendMessage(data, thisGame.room.currentQuestion.author.id);
    }
    let startRoundCallback;
    function AddEventStartRound(callback) {
        startRoundCallback = callback.bind({});
    }
    function StartRound() {
        if(startRoundCallback)
            startRoundCallback();
    }
    function SubmitAnswer(title) {
        const data = {
            type: "submit-answer",
            title,
        };
        SendMessage(data, thisGame.room.currentQuestion.author.id);
    }
</script>

<div class="room-wrap">
    <div class="room-left">
        <UserInfo users={thisGame.room.users}></UserInfo>
    </div>
    <div class="room-right">
        {#if !isLoaded}
                <LoadingComponent />
            {:else}
                {#if !questionWasWroten}
                    <div class="box-wrapper">
                        <Questioner OnFinish={OnFinishQuestion}></Questioner>
                    </div>
                {:else}
                    {#if thisGame.room.currentQuestion.author.id !== thisGame.player.id}
                        <AnswerForm 
                            OnReady={OnReadyToPlayMusic} 
                            AddEventStartRound={AddEventStartRound} 
                            SubmitAnswer={SubmitAnswer}
                            currectAnswerer={currectAnswerer}
                        />
                    {:else}
                        <QuestionUserInterface />
                    {/if}
            {/if}
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