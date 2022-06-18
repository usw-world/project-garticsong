<script>
    import { onMount } from 'svelte';
    import { PlayAudio, tryGuess, game, socket as mainSocket } from '../store';

    import UserInfo from '../UserInformation.svelte';
    import Questioner from './Questioner.svelte';
    import LoadingComponent from '../LoadingComponent.svelte';
    import QuestionUserInterface from './QuestionUserInterface.svelte';
    import ResultScreen from './ResultScreen.svelte';
    import CurrectAnswerer from "./CurrectAnswerer.svelte";
    import AnswerForm from './AnswerForm.svelte'
    import QuestionerExitAlert from './QuestionerExitAlert.svelte';
    import TimeoutAlert from './TimeoutAlert.svelte';
    import MusicVolumeManager from '../MusicVolumeManager';

    export let props;
    let thisGame;
    game.subscribe(value => { thisGame = value });

    let SomeoneTry;
    tryGuess.subscribe((value) => {
        SomeoneTry = value.Run;
    })

    let socket;
    mainSocket.subscribe(value => { socket = value; });

    let isLoaded = false;
    let currectAnswerer = null;
    let isWatingNextRound = false;
    let questionTimeout = false;
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
        channel.userId = targetUserId;
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
        console.log(eventData);
        switch(eventData.type) {
            case "connect":
                PushUserToConnectedUsers(eventData.sender);
                console.log("sender", eventData.sender);
                console.log("connectedUsers", thisGame.connectedUsers);
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
                console.log("Now, I'm a questioner!");
                bringers = [...thisGame.room.users];
                console.log(localQuestion);
                if(localQuestion["videoInfo"]) {
                    SendMessageAll({
                        type: "set-question",
                        question: {
                            ...localQuestion,
                            author: thisGame.player,
                        },
                    }, true);
                } else {
                    SendMessage({
                        type: "skip-question",
                    }, thisGame.room.host.id);
                }
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
                            roundIsRunning: true,
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
            case "someone-try": 
                SomeoneTry({ sender: eventData.sender, title: eventData.title });
                break;
            case "someone-guessed":
                if(currectAnswerer || questionTimeout) return;
                isWatingNextRound = true;
                currectAnswerer = eventData.answerer;
                game.update(game => {
                    return {
                        ...game,
                        room: {
                            ...thisGame.room,
                            lastQuestion: {...thisGame.room.currentQuestion},
                        }
                    }
                })
                endRound.Run();
                if(!thisGame.isGuest) {
                    let updatedGame = {...thisGame};
                    let questionerPoint = thisGame.room.config && thisGame.room.config.qs || 100;
                    let answererPoint = thisGame.room.config && thisGame.room.config.as || 100;

                    let authorId = thisGame.room.currentQuestion.author.id;
                    let answererId = eventData.answerer.id;
                    updatedGame.room.score[authorId] += questionerPoint;
                    updatedGame.room.score[answererId] += answererPoint;
                    game.update(() => updatedGame);
                }
                setTimeout(() => {
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
            case "appoint-subhost":
                AppointSubHost(eventData.nextSubhost);
                break;
            case "check-question-ready":
                const hostId = thisGame.room.host.id;
                if(!!localQuestion) SendMessage({ type: "readied-to-question" }, hostId);
                break;
            case "questioner-left":
                isWatingNextRound = true;
                endRound.Run();
                break;
            case "sync-room":
                game.update(game => {
                    return {
                        ...game,
                        room: eventData.updatedRoom,
                    }
                });
                console.log(thisGame);
                break;
            case "skip-question":
                CarryNextRound();
                break;
            case "show-hint":
                SeeHint();
                break;
            case "question-timeout":
                if(currectAnswerer) return;
                questionTimeout = true;
                isWatingNextRound = true;
                endRound.Run();
                setTimeout(() => {
                    if(!thisGame.isGuest)
                        CarryNextRound();
                }, 3000);
                break;
        }
    }
    function CarryNextRound() {
        let readiedUsers = thisGame.room.readiedUsers;

        console.log(thisGame.room.users)
        console.log(readiedUsers);
        if(readiedUsers.length>0 && thisGame.room.users.length>1) {
            const data = {
                type: "make-questioner",
            }
            let nextQuestioner = readiedUsers.shift()
            let updatedRoom = {...thisGame.room};
            updatedRoom.readiedUsers = [...readiedUsers];
            SendMessageAll({type: "sync-room", updatedRoom}, true);
            SendMessage(data, nextQuestioner);
            
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
    function OnCloseChannel(e) { 
        // first, room is will updated. and will share room other users.
        let leftUserId = e.target.userId;
        let updatedUsers = [...thisGame.room.users];
        let nextHost = thisGame.room.host;
        let nextSubhost;
        let nextPeerConnectionList = {...thisGame.peerConnections};
        let nextSignalChennlList = {...thisGame.signalChannels};

        updatedUsers = updatedUsers.filter(user => leftUserId !== user.id);
        nextSubhost = updatedUsers.find(user => user.id !== thisGame.player.id);
        delete nextPeerConnectionList[leftUserId];
        delete nextSignalChennlList[leftUserId];
        if(leftUserId === thisGame.room.host.id) // if left user is host
            nextHost = {...thisGame.room.subHost};
            
        game.update(game => {
            return {
                ...game,
                peerConnections: nextPeerConnectionList,
                signalChannels: nextSignalChennlList,
                room: {
                    ...thisGame.room,
                    users: updatedUsers,
                    host: nextHost,
                    readiedUsers: thisGame.room.readiedUsers.filter(userId => userId!==leftUserId),
                    subHost: nextSubhost,
                    // << delegate host
                },
                isGuest: nextHost.id===thisGame.player.id ? false : true, 
            }
        });
        
        if(thisGame.room.users.length<=1) {
            SendMessageAll({
                type: "end-game",
                score: thisGame.room.score,
            }, true);
        }
        
        if(!thisGame.isGuest) {
            SendMessageAll({type: "sync-room", updatedRoom: thisGame.room}, true);
        }
        
        if(!thisGame.room.roundIsRunning) {
            SendMessageAll({ type: "check-question-ready" }, true);
        } else if(!thisGame.isGuest) {
            const question = thisGame.room.currentQuestion;
            if(!isWatingNextRound && leftUserId===question.author.id) { // questioner left
                SendMessageAll({ type: "questioner-left" }, true);
                setTimeout(() => {
                    CarryNextRound();
                }, 2000);
            }
        }
    }
    onMount(() => {
        window.onbeforeunload = () => "페이지를 벗어나려고 해요. 의도대로 인가요?";
        game.update(game => {
            return {
                ...game,
                peerConnections : {},
                signalChannels : {},
                connectedUsers : [],
                room: {
                    ...thisGame.room,
                    readiedUsers: [],
                },
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
            channel.onclose = OnCloseChannel;
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
            channel.onclose = OnCloseChannel;
            PushDataChannelToArray(channel, payload.targetUser.id);

            const offer = await localPeerConnection.createOffer();
            localPeerConnection.setLocalDescription(offer);
            socket.emit("offer-to-another", offer, payload)
        })
        socket.on("ready-to-start", () => {
            isLoaded = true;
            if(!thisGame.isGuest) {
                FindNewSubHost();
            }
        })
        socket.emit("ready-to-connect", thisGame.room.roomId);
    });

    let localQuestion;

    const FindNewSubHost = () => {
        let nextSubhost = thisGame.room.users.find(user => user.id !== thisGame.player.id);
        const data = {
            type: "appoint-subhost",
            nextSubhost,
        }
        SendMessageAll(data, true);
    }
    const AppointSubHost = (targetUser) => {
        game.update(game => {
            return {
                ...game,
                room: {
                    ...game.room,
                    subHost: targetUser
                }
            }
        })
        console.log("sub host was updated : ", thisGame.room);
    }
    const OnFinishQuestion = (questionInfo) => {
        console.log(questionInfo);
        isLoaded = false;
        localQuestion = questionInfo ? {...questionInfo} : {};
        console.log(localQuestion); 
        
        const hostId = thisGame.room.host.id;
        let data = { type: "readied-to-question" }
        SendMessage(data, hostId);
    }
    function UserIsReady(userId) {
        let readiedUsers = thisGame.room.readiedUsers;
        if(readiedUsers.indexOf(userId) < 0) {
            readiedUsers.push(userId);
        } 
        let remainingUsersNumber = thisGame.room.users.filter(user => {
            return readiedUsers.indexOf(user.id) < 0;
        }).length;
        if(remainingUsersNumber<=0) {
            let updatedRoom = {...thisGame.room};
            if(!updatedRoom.score)
                updatedRoom.score = {};
            thisGame.room.users.forEach(user => {
                updatedRoom.score[user.id] = 0;
            });
            updatedRoom.readiedUsers = readiedUsers;
            SendMessageAll({type: "sync-room", updatedRoom}, true);
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
    let ResetTimer;
    function ReadyToAnswer(question) {
        isWatingNextRound = false;
        questionTimeout = false;
        currectAnswerer = null;
        ResetTimer && ResetTimer();
        game.update(game => {
            return {
                ...game,
                room: {
                    ...thisGame.room,
                    showingHint: false,
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
    function SubmitAnswer(title, originTitle) {
        const data = {
            type: "submit-answer",
            title,
        };
        SendMessage(data, thisGame.room.currentQuestion.author.id);
        SendMessageAll({type: "someone-try", title: originTitle}, true);
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
    function SeeHint() {
        game.update(game => {
            return {
                ...game,
                room: {
                    ...thisGame.room,
                    showingHint: true,
                }
            }
        })
    }
    function ShowHint() {
        PlayAudio("/soundEffects/hint.wav");
        const data = {
            type: "show-hint",
        }
        SendMessageAll(data, true);
    }
    function OnTimeout() {
        SendMessageAll({ type: "question-timeout" }, true);
    }
</script>

<div class="room-wrap">
    <div class="room-header">
        <img src="/images/logo.svg" alt="">
    </div>
    <div class="room-left">
        <UserInfo users={thisGame.room.users}></UserInfo>
    </div>
    <div class="room-right">
        {#if thisGame.room.gameDone}
            <ResultScreen
                users={thisGame.room.users}
                scores={thisGame.room.finalScore}
                RestartGame={RestartGame}
            />
        {:else if !isLoaded}
            <LoadingComponent />
        {:else}
            {#if !localQuestion}
                <div class="box-wrapper">
                    <Questioner OnFinish={OnFinishQuestion}></Questioner>
                </div>
            {:else}
                {#if thisGame.room.currentQuestion.author.id !== thisGame.player.id}
                    <AnswerForm 
                        OnReady={OnReadyToPlayMusic}
                        startRound={startRound}
                        endRound={endRound}
                        SubmitAnswer={SubmitAnswer}
                        bind:ResetTimer={ResetTimer}
                    />
                    {#if isWatingNextRound}
                        {#if questionTimeout}
                            <TimeoutAlert />
                        {:else if !currectAnswerer}
                            <QuestionerExitAlert />
                        {:else}
                            <CurrectAnswerer user={currectAnswerer}/>
                        {/if}
                    {/if}
                {:else}
                    <QuestionUserInterface
                        OnReady={OnReadyToPlayMusic}
                        startRound={startRound}
                        endRound={endRound}
                        SubmitAnswer={SubmitAnswer}
                        ShowHint={ShowHint}
                        OnTimeout={OnTimeout}
                        bind:ResetTimer={ResetTimer}
                    />
                    {#if isWatingNextRound}
                        {#if questionTimeout}
                            <TimeoutAlert />
                        {:else if !currectAnswerer}
                            <QuestionerExitAlert />
                        {:else}
                            <CurrectAnswerer user={currectAnswerer}/>
                        {/if}
                    {/if}
                {/if}
            {/if}
        {/if}
    </div>
    <div class="room-footer">
        <MusicVolumeManager />
    </div>
</div>

<style>
    .room-header {
        position: absolute;
        top: -3rem;
        width: 100%;
        text-align: right;
        
    }
    .room-header>img {
        width: 15rem;
        opacity: .8;
    }
    .room-footer {
        position: absolute;
        left: 0; bottom: -7.2rem;
        width: 100%;
        text-align: center;
    }
    .room-wrap {
        position: relative;
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
    }
    .room-left {
        position: relative;
        width: 22%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 0 10rem;
        z-index: 2;
    }
    .room-right {
        position: relative;
        overflow: hidden;
        width: 78%;
        height: 100%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 10rem 0;
        z-index: 1;
    }
</style>