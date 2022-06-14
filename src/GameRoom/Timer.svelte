<script>
    import { game } from "../store";
    let thisGame;
    game.subscribe(value => { thisGame = value; });
</script>

<div class="timer-wrap">
    <div class="timer-trail">
        <input class="slide" type="range" min="0" max="100" name="" id="">
    </div>
</div>

<style>
    .slide {
        -webkit-appearance: none;
        appearance: none;
    }
    .slide::-webkit-slider-thumb {
        appearance: none;
        width: 3rem;
        height: 3rem;
        background-color: #fff;
    }
    .slide::-moz-range-thumb {
        -moz-appearance: none;
        border: none;
        border-radius: 0;
        width: 3rem;
        height: 3rem;
    }
</style>