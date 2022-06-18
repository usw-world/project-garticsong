<script>
    import { onDestroy, onMount } from 'svelte';
    import { game } from "../store";
    let thisGame;
    export let widthRatio;
    export let props; /* startTime, time, interval=1000 */
    export let ResetTimer;
    let currentTime;
    let currentWidth;
    let timerRunning = true;
    
    if(props) {
        props.interval = props.interval || 1000;
        props.startTime = props.startTime || 0;
    }
    currentTime = props.startTime;

    game.subscribe(value => { thisGame = value; });
    
    let repeater;
    onMount(() => {
        ResetTimer = () => {
            // clearInterval(repeater);
            currentTime = props.startTime;
            timerRunning = true;
            // repeater = TimerInterval();
        };
        repeater = TimerInterval();
    })
    onDestroy(() => {
        console.log("destroy");
        clearInterval(repeater);
        currentTime = props.startTime;
    });
    function TimerInterval() {
        return setInterval(() => {
            if(!timerRunning) return;
            // console.log('drill', currentTime);
            TimerRender();
            if(currentTime + props.interval >= props.time) {
                // console.log("egg", currentTime);
                timerRunning = false;
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
        width: ${widthRatio ? widthRatio+'%' : 80+"rem "};
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
        margin: 0 auto 0;
        padding: 1rem 2rem;
        border: .5rem solid #fff;
        box-sizing: border-box;
        border-radius: 2.5rem;
        background-color: rgba(255, 255, 255, .2);
    }
    .timer-trail {
        border: .3rem solid var(--point-color-b);
        height: 1.4rem;
        display: flex;
        border-radius: .7rem;
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;
        /* justify-content: center; */
        align-items: center;
    }
    .timer-fill {
        position: relative;
        left: -0.1rem;
        width: 0%;
        height: 102%;
        background-color: var(--point-color-b);
    }
</style>