<script>
    import { onMount } from 'svelte';
    import { game } from './store';
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    
    onMount(() => {
        SetConfiguration();
    })
    function SetConfiguration() {
        let config;
        config = {
            qs: document.querySelector(".qs>input[type='radio']:checked").value,
            as: document.querySelector(".as>input[type='radio']:checked").value,
            time: document.querySelector(".time>input[type='radio']:checked").value,
        };
        game.update(game => {
            return {
                ...game,
                room: {
                    ...thisGame.room,
                    config: config
                }
            }
        });
        console.log(thisGame.room.config);
    }
</script>

<form>
    <fieldset class="qs">
        <legend>출제자 획득 점수</legend>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="qs" id="qs100" value="100" checked>
        <label for="qs100">100</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="qs" id="qs200" value="200">
        <label for="qs200">200</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="qs" id="qs300" value="300">
        <label for="qs300">300</label>
    </fieldset>
    <fieldset class="as">
        <legend>정답자 획득 점수</legend>
        <input on:change="{() => { SetConfiguration(); }}" type="radio"  name="as" id="as100" value="100" checked>
        <label for="as100">100</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="as" id="as200" value="200">
        <label for="as200">200</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="as" id="as300" value="300">
        <label for="as300">300</label>
    </fieldset>
    <fieldset class="time">
        <legend>제한시간</legend>
        <input on:change="{() => { SetConfiguration(); }}" type="radio"  name="time" id="time30" value="30" checked>
        <label for="time30">30초</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="time" id="time60" value="60">
        <label for="time60">60초</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="time" id="time90" value="90">
        <label for="time90">90초</label>
        <input on:change="{() => { SetConfiguration(); }}" type="radio" name="time" id="alltime" value="0">
        <label for="alltime">노래 전체</label>
    </fieldset>
</form>

<style>
    form {
        width: 100%;
        height: 100%;
        padding: 3rem 4rem;
        box-sizing: border-box;
    }
    legend {
        display: inline-block;
        font-size: 1.7rem;
        font-weight: 900;
        padding: 2.6rem 0 .6rem;
    }
    input {
        display: none;
    }
    label {
        display: inline-block;
        border: .3rem solid rgba(255, 255, 255, 1);
        padding: 1rem 2rem;
        margin: 0 0.2rem;
        font-size: 2rem;
        font-weight: 900;
        border-radius: 2.3rem;
        box-sizing: border-box;
        cursor: pointer;
    }
    input:checked+label {
        color: var(--point-color-b);
        border-color: var(--point-color-b);
        background-color: rgba(255, 39, 136, 0.2);
    }
</style>