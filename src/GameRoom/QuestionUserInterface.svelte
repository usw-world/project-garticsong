<script>
    import { game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    import VideoPlayer from "./VideoPlayer.svelte";
    import QuestionerTimer from "./QuestionerTimer.svelte";
    
    export let OnReady;
    export let startRound;
    export let endRound;
    export let ShowHint;
    export let OnTimeout
    export let ResetTimer;
</script>

<div class="questioner-interface">
    <div class="title">{thisGame.room.currentQuestion.videoInfo.originTitle}</div>
    <div class="tumbnail-wrap">
        <img src="https://img.youtube.com/vi/{thisGame.room.currentQuestion.videoInfo.videoId}/0.jpg" alt="">
    </div>
    <div class="timer-wrap">
        <QuestionerTimer bind:ResetTimer={ResetTimer} props={{OnTimeout: OnTimeout, startTime: -3000, time: thisGame.room.config.time * 1000, interval: 25, isQuestioner: true}}/>
    </div>
    <VideoPlayer 
        OnReady={OnReady} 
        videoInfo={thisGame.room.currentQuestion.videoInfo} 
        startRound={startRound}
        endRound={endRound}
    />
    <div class="description">{thisGame.room.currentQuestion.description}</div>
    <button class="hint-button" on:click="{ShowHint}" style={`
        opacity: ${thisGame.room.showingHint ? 0 : 1};
        pointer-events: ${thisGame.room.showingHint ? "none" : "initial"};
    `}>
        힌트 공개
    </button>
    <div class="answer-description"></div>
</div>

<style>
    .timer-wrap {
        margin: 0;
    }
    .questioner-interface {
        padding: 5rem 0;
        text-align: center;
    }
    .tumbnail-wrap {
        position: relative;
        display: flex;
        width: 26rem;
        height: 26rem;
        margin: 0 auto;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        border-radius: 13rem;
        border: .5rem solid rgba(255, 255, 255, .75);
    }
    .tumbnail-wrap>img {
        height: 105%;
        animation: spin8 12000ms linear infinite;
    }
    .tumbnail-wrap::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: calc(50% - 4.5rem);
        left: calc(50% - 4.5rem);
        width: 9rem;
        height: 9rem;
        border: .3rem solid rgba(21, 21, 21, .5);
        border-radius: 4.5rem;
        box-sizing: border-box;
        z-index: 1;
    }
    .tumbnail-wrap::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: calc(50% - 3rem);
        left: calc(50% - 3rem);
        width: 6rem;
        height: 6rem;
        background-color: #151515;
        border-radius: 3rem;
    }
    .title {
        margin-bottom: 2rem;
        font-size: 4rem;
        font-weight: 900;
    }
    .tumbnail-wrap {
        margin-bottom: 2rem;
    }
    .description {
        max-height: 9.4rem;
        font-size: 1.9rem;
        font-weight: 100;
        margin-bottom: 1.4rem;
        overflow: hidden;
    }
    .hint-button {
        transition: opacity 400ms ease;
        color: #fff;
        padding: 1.2rem 3rem 1rem;
        border-radius: 2.7rem;
        border: .3rem solid #fff;
        background-color: #454545;
        cursor: pointer;
    }
    .hint-button:hover {
        background-color: #565656;
    }
    .hint-button:active {
        background-color: #343434;
    }
</style>