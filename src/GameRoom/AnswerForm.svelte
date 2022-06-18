<script>
    import { PlayAudio, game } from "../store";
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    import { onMount } from "svelte";
    import VideoPlayer from "./VideoPlayer.svelte";
    import Timer from "./Timer.svelte";

    export let OnReady;
    export let startRound;
    export let endRound;
    export let SubmitAnswer;
    export let showingHint;
    export let ResetTimer;
    showingHint = showingHint || false;
    let showingInput = false;
    let answerInput;
    onMount(() => {
        PlayAudio("/soundEffects/start-question.wav");
    });
    function OnRoundStart() {
        showingInput = true;
        answerInput.focus();
    }
    function OnRoundEnd() {
        setTimeout(() => {
            showingInput = false;
        }, 1000);
    }
    function OnSubmit(e){
        let originTitle = e.target.answer.value;
        let title = originTitle;
        title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, "").toLowerCase();
        if(title !== thisGame.room.currentQuestion.title) 
            OnInputError();

        OnGuess(title, originTitle);
        e.target.answer.value = "";
    }
    function OnInputError() {
        answerInput.style.animation = "inputError 400ms ease 1 forwards";
    }
    function ResetInputStatus() {
        answerInput.style.animation = "none";
    }
    function OnGuess(title, originTitle) {
        SubmitAnswer(title, originTitle);
    }
</script>

<form class="question-form" on:submit|preventDefault = {OnSubmit}>
    <Timer bind:ResetTimer={ResetTimer} widthRatio={59} props={{startTime: -3000, time: thisGame.room.config.time * 1000, interval: 25}} />
    <div class="input-wrap" style="
        height: {showingInput ? "28" : "0"}%;
        opacity: {showingInput ? "1" : "0"};
        margin-top: {showingInput ? "4" : "3"}rem;
    ">
        <VideoPlayer 
            OnReady={OnReady} 
            videoInfo={thisGame.room.currentQuestion.videoInfo} 
            startRound={startRound}
            endRound={endRound}
            OnRoundStart={OnRoundStart}
            OnRoundEnd={OnRoundEnd}
        />
        <div class="answer-request">정답을 입력하세요!</div>
        <input type="text" class="answer-answer" name="answer" bind:this={answerInput} 
            on:focus="{ResetInputStatus}"
            on:input="{ResetInputStatus}"
            autocomplete="off"
        >
        <input id="answer-submit-button" class="answer-button" type="submit" value="확인">
    </div>
    <div class="answer-description">
        <div class="author">{thisGame.room.currentQuestion.author.name}의 문제</div>
        {thisGame.room.currentQuestion.description}
    </div>
    <div class="hint-area">
        {#if thisGame.room.showingHint}
            <div class="hint-box">{thisGame.room.currentQuestion.hint}</div>
        {/if}
    </div>
</form>

<style>
    .question-form{
        padding-top: 5rem;
        transition: 400ms ease opacity;
        height: 100%;
        box-sizing: border-box;
    }
    .input-wrap {
        transition: height 400ms ease,
                    margin 400ms ease,
                    opacity 400ms ease;
        position: relative;
        width: 100%;
        height: 0%;
        flex-direction: column;
        text-align: center;
        overflow: hidden;
        font-size: 0;
    }
    .answer-description {
        width: 60%;
        max-height: 45%;
        padding: 2rem 3rem;
        margin: 0 auto 2.5rem;
        font-size: 2.3rem;
        font-weight: 100;
        text-align: center;
        border: .5rem solid rgba(255, 255, 255, .1);
        /* background-color: rgba(255, 255, 255, .1); */
        border-radius: 2.4rem;
        line-height: 1.4;
        box-sizing: border-box;
        overflow: hidden;
        word-break: break-all;
    }
    .answer-description>.author {
        font-weight: 900;
        font-size: 1.9rem;
        margin-bottom: 1.2rem;
    }
    .answer-description>.author::after {
        content: "";
        margin: 0 auto;
        display: block;
        width: 2em;
        height: 0.5rem;
        margin-top: 1.2rem;
        background-color: rgba(255, 255, 255, 1);
        border-radius: .25rem;
    }
    .answer-request{
        margin-bottom: 1.8rem;
        font-size: 3rem;
        font-weight: 900;
        text-align: center;
    }
    .answer-answer {
        transition: color 400ms ease;
        display: inline-block;
        width: 56rem;
        height: 6.6rem;
        margin-bottom: 3rem;
        padding: 1rem;
        font-size: 2.2rem;
        text-align: center;
        border-right: 0;
        border-width: .3rem;
        border-radius: 3.3rem 0 0 3.3rem;
        overflow: hidden;
        vertical-align: middle;
    }
    input[type="submit"] {
        display: inline-block;
        height: 6.6rem;
        margin-bottom: 3rem;
        padding: 1rem 2rem;
        font-size: 2.2rem;
        letter-spacing: .2rem;
        border-left: 0;
        border-width: .3rem;
        border-radius: 0 3.3rem 3.3rem 0;
        vertical-align: middle;
        cursor: pointer;
    }
    .hint-area {
        padding: 1.2rem 1rem 0.8rem;
        color: var(--point-color-b);
        font-size: 2.3rem;
        font-weight: 900;
        text-align: center;
    }
    .hint-box {
        animation: fadeUpIn 400ms ease 1 forwards;
    }
</style>