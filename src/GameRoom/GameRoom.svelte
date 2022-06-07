<script>
    import UserInfo from '../UserInformation.svelte';
    import Questioner from './Questioner.svelte';
    import LoadingComponent from '../LoadingComponent.svelte';
    import QuestionUserInterface from './QuestionUserInterface.svelte';
    import ResultScreen from './ResultScreen.svelte';
    import CurrectAnswerer from "./CurrectAnswerer.svelte";
    import AnswerForm from './AnswerForm.svelte'
    import { onMount } from 'svelte';
    import { game, socket as mainSocket } from '../store';

    export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    let isLoaded = false;
    let currectAnswerer = null;
    let readiedUsers = [];
    let bringers = [];
    let WATING_TIME_FOR_RESPONSE = 20000;

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
                console.log(eventData);
                ReadyToAnswer(eventData.question);
                break;
            case "make-questioner":
                // console.log("Receive the message to make me questioner", eventData);
                bringers = [...thisGame.room.users];
                SendMessageAll({
                    type: "set-question",
                    question: {
                        ...localQuestion,
                        author: thisGame.player,
                    },
                }, true);
                break;
            case "readied-to-play-music":
                bringers = bringers.filter(bringer => {
                    bringer.id !== eventData.sender;
                });
                if(bringers.length <= 0) {
                    SendMessageAll({type: "start-round"}, true);
                }
                break;
            case "start-round":
                game.update(game => {
                    return {
                        ...game,
                        room: {
                            ...thisGame.room,
                            roundStarted: true,
                        }
                    }
                })
                startRound.Run();
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
                if(currectAnswerer) return;
                game.update(game => {
                    return {
                        ...game,
                        room: {
                            ...thisGame.room,
                            lastQuestion: {...thisGame.room.currentQuestion},
                        }
                    }
                })
                currectAnswerer = eventData.answerer;
                endRound.Run();

                if(!thisGame.isGuest) {
                    let updatedGame = {...thisGame};
                    let questionerPoint = thisGame.room.setting && thisGame.room.setting.questionerPoint || 100;
                    let answererPoint = thisGame.room.setting && thisGame.room.setting.answerer || 100;
                    updatedGame.room.score[thisGame.room.currentQuestion.author.id] = updatedGame.room.score[thisGame.room.currentQuestion.author.id] + questionerPoint;
                    updatedGame.room.score[eventData.answerer.id] = updatedGame.room.score[eventData.answerer.id] + answererPoint;
                    game.update(() => updatedGame);
                }
                setTimeout(() => {
                    currectAnswerer = null;
                    if(!thisGame.isGuest)
                        CarryNextRound();
                }, 2000);
                break;
            case "end-game":
                game.update(game => {
                    return {
                        ...game,
                        room: {
                            ...thisGame.room,
                            gameDone: true,
                            finalScore: eventData.score,
                        }
                    }
                });
                break;
            case "restart":
                props.SetGameState(2, 400, null, () => {
                    localQuestion = null;
                    isLoaded = false;
                    game.update(game => {
                        return {
                            ...game,
                            room: {
                                ...thisGame.room,
                                currentQuestion: null,
                                gameDone: false,
                            }
                        }
                    });
                    console.log(thisGame);
                    SendMessage({type: "ready-to-restart"}, thisGame.room.host.id);
                });
                break;
            case "ready-to-restart":
                restartingQueue = restartingQueue.filter(user => {
                    return user.id !== eventData.sender.id;
                })
                if(restartingQueue.length===0) {
                    const data = {
                        type: "restart-as-these",
                        room: { ...thisGame.room },
                    }
                    if(restartTimeout) clearTimeout(restartTimeout);
                    SendMessageAll(data, true);
                }
                break;
            case "restart-as-these":
                game.update(game => {
                    return {
                        ...game,
                        room: {...eventData.room},
                    };
                });
                isLoaded = true;
                break;
        }
    }
    function CarryNextRound() {
        if(readiedUsers.length>0) {
            const data = {
                type: "make-questioner",
            }
            console.log(readiedUsers);
            SendMessage(data, readiedUsers.shift());
        } else {
            SendMessageAll({
                type: "end-game",
                score: thisGame.room.score,
            }, true);
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
            });

            let channel = await localPeerConnection.createDataChannel('signal');
            channel.onopen = OnOpenChannel;
            channel.onclose = (e) => { console.log("Channel is Closed", e) };
            PushDataChannelToArray(channel, senderId);

            localPeerConnection.setRemoteDescription(offer);
            const answer = await localPeerConnection.createAnswer();
            localPeerConnection.setLocalDescription(answer);
            socket.emit("answer-to-sender", answer, senderId);
        });
        socket.on("answer-to-sender", async (answer, answererId) => { // local-2
            let peerConnection =  thisGame.peerConnections[answererId];
            peerConnection.remoteSocketId = answererId;
            if(peerConnection) {
                peerConnection.setRemoteDescription(answer);
            }
        });
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

    let localQuestion;

    const OnFinishQuestion = (questionInfo) => {
        isLoaded = false;
        localQuestion = {...questionInfo};
        game.update(game => {
            return {
                ...game,
            }
        });
        
        const hostId = thisGame.room.host.id;
        let data = {
            sender: thisGame.player,
            type: "readied-to-question",
        }
        SendMessage(data, hostId);
    }
    function UserIsReady(userId) {
        readiedUsers.push(userId);
        let remainingUsersNumber = thisGame.room.users.filter(user => {
            return readiedUsers.indexOf(user.id) < 0;
        }).length;
        if(remainingUsersNumber<=0) {
            let updatedGame = {...thisGame};
            if(!updatedGame.room.score)
                updatedGame.room.score = {};
            thisGame.room.users.forEach(user => {
                updatedGame.room.score[user.id] = 0;
            })
            game.update(() => updatedGame);
            CarryNextRound();
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
        }, 400);
    }
    function OnReadyToPlayMusic(e) {
        const data = {
            type: "readied-to-play-music",
        }
        SendMessage(data, thisGame.room.currentQuestion.author.id);
    }
    let startRound = {
        callback: null,
        AddEvent: (callback) => {
            startRound.callback = callback.bind({});
        },
        Run: () => {
            if(startRound.callback)
                startRound.callback();
        }
    }
    let endRound = {
        callback: null,
        AddEvent: (callback) => {
            endRound.callback = callback.bind({});
        },
        Run: () => {
            if(endRound.callback)
                endRound.callback();
        }
    }
    function SubmitAnswer(title) {
        const data = {
            type: "submit-answer",
            title,
        };
        SendMessage(data, thisGame.room.currentQuestion.author.id);
    }
    let restartingQueue;
    let restartTimeout;
    function RestartGame() {
        restartingQueue = [...thisGame.room.users];
        SendMessageAll({ type: "restart" }, true);
        restartTimeout = setTimeout(() => {
            let nextUsers = thisGame.room.users;
            restartingQueue.forEach((item) => {
                nextUsers = nextUsers.filter(() => nextUsers.indexOf(item.id)<0);
            });
            const data = {
                type: "restart-as-these",
                room: {
                    ...thisGame.room,
                    users: nextUsers,
                },
            }
            SendMessageAll(data, true);
        }, WATING_TIME_FOR_RESPONSE);
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
            {#if !localQuestion}
                <div class="box-wrapper">
                    <Questioner OnFinish={OnFinishQuestion}></Questioner>
                </div>
            {:else if thisGame.room.gameDone}
                <ResultScreen
                    users={thisGame.room.users}
                    scores={thisGame.room.finalScore}
                    RestartGame={RestartGame}
                />
            {:else}
                {#if thisGame.room.currentQuestion.author.id !== thisGame.player.id}
                    <AnswerForm 
                        OnReady={OnReadyToPlayMusic}
                        startRound={startRound}
                        endRound={endRound}
                        SubmitAnswer={SubmitAnswer}
                    />
                {:else}
                    <QuestionUserInterface />
                {/if}
            {/if}
            {#if currectAnswerer}
                <CurrectAnswerer user={currectAnswerer}/>
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
        position: relative;
        height: 100%;
        box-sizing: border-box;
        border: 5px solid transparent;
        overflow: hidden;
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