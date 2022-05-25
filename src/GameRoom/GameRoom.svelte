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

    const AddPeerConnection = (pc) => {
        let nextPcs = thisGame.peerConnections;
        nextPcs.push(pc);
        game.update(game => {
            return {
                ...game,
                peerConnections: nextPcs,
            }
        });
    };
    onMount(() => {
        game.update(game => {
            return {
                ...game,
                peerConnections : [],
                signalChannels : [],
            };
        });
        socket.emit("ready-to-connect", thisGame.room.id);
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
        <div class="box-wrapper">
            {#if !isCleared}
                <Questioner bind:this={questionElmt} OnFinish={OnFinishQuestion}></Questioner>
            {:else}
                <!-- <LoadingComponent /> -->
                <AnswerRoom answerObj={answerObj} />
            {/if}
        </div>
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