<script>
    import { game } from './store';
    let thisGame;
    game.subscribe(value => {
        thisGame = value;
    })
    
    function SetSettings() {
        let settings;
        settings = {
            qs: document.querySelector(".qs>input[type='radio']:checked").value,
            as: document.querySelector(".as>input[type='radio']:checked").value,
            time: document.querySelector(".time>input[type='radio']:checked").value,
        };
        game.update(game => {
            return {
                ...game,
                room: {
                    ...thisGame.room,
                    settings
                }
            }
        });
        console.log(thisGame);
    }
</script>

<form>
    <fieldset class="qs">
        <legend>출제자 획득 점수</legend>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="qs" id="qs100" value="100" checked>
        <label for="qs100">100</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="qs" id="qs200" value="200">
        <label for="qs200">200</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="qs" id="qs300" value="300">
        <label for="qs300">300</label>
    </fieldset>
    <fieldset class="as">
        <legend>정답자 획득 점수</legend>
        <input on:change="{() => { SetSettings(); }}" type="radio"  name="as" id="as100" value="100" checked>
        <label for="as100">100</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="as" id="as200" value="200">
        <label for="as200">200</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="as" id="as300" value="300">
        <label for="as300">300</label>
    </fieldset>
    <fieldset class="time">
        <legend>제한시간</legend>
        <input on:change="{() => { SetSettings(); }}" type="radio"  name="time" id="time30" value="30" checked>
        <label for="as100">30초</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="time" id="time60" value="60">
        <label for="as200">60초</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="time" id="time90" value="90">
        <label for="as300">90초</label>
        <input on:change="{() => { SetSettings(); }}" type="radio" name="time" id="alltime" value="0">
        <label for="as300">노래 전체</label>
    </fieldset>
</form>