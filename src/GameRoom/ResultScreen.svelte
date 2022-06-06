<script>
    import { onMount } from 'svelte';
    import { game } from '../store';
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    });
    import ScoreInterface from './ScoreInterface.svelte';
    export let users;
    export let scores;
    let maxScore = Object.values(scores).reduce((a, b) => {
        return Math.max(a, b);
    });
    console.log(maxScore);
    let scoreList = [...users];
    for(let i=0; i<scoreList.length; i++) {
        scoreList[i] = {...scoreList[i], score: scores[scoreList[i].id]}
    };
</script>

<div class="result-wrap">
    <div class="score-wrap">
        {#each scoreList as user}
            <ScoreInterface user={user} maxScore={maxScore} />
        {/each}
    </div>
    {#if !thisGame.isGuest}
        <div class="button-wrap">
            <button class="restart-button">
                다시하기
            </button>
        </div>
    {/if}
</div>

<style>
    .button-wrap>button {
        /* translate: background-color 400ms ease; */
        color: var(--point-color-b);
        border: .5rem solid var(--point-color-b);
        background-color: rgba(255, 255, 255, 0);
        cursor: pointer;
    }
    .button-wrap>button:hover {
        background-color: rgba(255, 255, 255, 0.12);
    }
    .result-wrap {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 3rem;
    }
    .score-wrap {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 2%;
    }
</style>