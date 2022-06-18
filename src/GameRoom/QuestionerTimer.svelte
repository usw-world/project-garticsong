<script>
    import { onMount, onDestroy } from 'svelte';
    import { game } from "../store";
    let thisGame;
    export let widthRatio;
    export let props; /* startTime, time, interval=1000 */
    export let ResetTimer;
    let currentTime;
    let currentWidth; 
    
    if(props) {
        props.interval = props.interval || 1000;
        props.startTime = props.startTime || 0;
    }
    currentTime = props.startTime;

    game.subscribe(value => { thisGame = value; });
    
    let repeater;
    onMount(() => {
        ResetTimer = () => {
            currentTime = props.startTime;
            repeater = TimerInterval();
        };
        repeater = TimerInterval();
    })
    onDestroy(() => {
        clearInterval(repeater);
        currentTime = props.startTime;
    });
    function TimerInterval() {
        return setInterval(() => {
            TimerRender();
            if(currentTime + props.interval >= props.time) {
                clearInterval(repeater);
                setTimeout(() => {
                    TimerRender()
                    props.OnTimeout && props.OnTimeout();
                }, props.time - currentTime);
            }
        }, props.interval);
    }
    function TimerRender() {
        currentTime += props.interval;
        currentWidth = (currentTime / props.time) * 100 + "%";
    }
</script>

{#if props.time}
    <div class="timer-wrap" style="{`
        width: ${widthRatio ? widthRatio+'%' : 40+"rem "};
    `}">
        <div class="timer-trail">
            <div class="timer-fill" style={`width: ${currentWidth};`}></div>
        </div>
    </div>
{:else}
    <div class="timer-error">
        타이머에 시간이 할당되지 않았습니다.
    </div>
{/if}

<style>
    .timer-wrap {
        margin: 2rem auto 2rem;
        padding: 1rem 2rem;
        border: .4rem solid #fff;
        box-sizing: border-box;
        border-radius: 2.5rem;
        background-color: rgba(255, 255, 255, .2);
    }
    .timer-trail {
        /* border: .2rem solid var(--point-color-b); */
        height: 1.2rem;
        display: flex;
        border-radius: .6rem;
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;
        /* justify-content: center; */
        align-items: center;
    }
    .timer-fill {
        width: 0%;
        height: 102%;
        background-color: var(--point-color-b);
    }
</style>