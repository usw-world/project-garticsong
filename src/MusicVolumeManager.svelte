<script>
    import { musicVolume } from "./store";
    let musicVolumeObj;
    musicVolume.subscribe(value => {
        musicVolumeObj = value;
    })
    function OnChange(e) {
        musicVolumeObj.set(Number(e.target.value));
    }
</script>

<div class="manager-wrap">
    <img src="/images/volume.svg" alt="">
    <input type="range" max="100" min="0" value={musicVolumeObj.value} name="volume" id="volume" on:input="{OnChange}">
</div>

<style>
    .manager-wrap {
        width: 100%;
        padding: 2rem;
    }
    .manager-wrap>img {
        height: 3.2rem;
        vertical-align: middle;
        margin-right: 1.3rem;
    }
    .manager-wrap>input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 25rem;
        height: 2.5rem;
        padding: 0;
        border: .3rem solid #fff;
        box-sizing: border-box;
        vertical-align: middle;
        overflow: hidden;
    }
    .manager-wrap>input[type="range"]::-ms-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 3.2rem;
        height: 2.5rem;
        background-color: #fff;
        border-radius: .5rem;
    }
    .manager-wrap>input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 3.2rem;
        height: 2.5rem;
        background-color: #fff;
        border-radius: .5rem;
    }
    .manager-wrap>input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 3.2rem;
        height: 2.5rem;
        background-color: #fff;
        border-radius: .5rem;
    }
</style>