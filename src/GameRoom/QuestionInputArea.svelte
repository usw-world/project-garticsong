<script>
    export let state;
    console.log(state);
</script>


<input class="input-url" type="text" name="url" placeholder="https://www.youtube.com/watch?v=pKv_wua6kFE" autocomplete="off">
<input class="input-title" type="text" name="title" placeholder="Dragon Rider" autocomplete="off">
<textarea class="input-description" name="description" placeholder="영어 제목
Two Steps From Hell - oooooo ooooo" autocomplete="off"></textarea>
<textarea class="input-hint" name="hint" placeholder="용 기수
Dooooo Roooo" autocomplete="off"></textarea>

<style>
    input, textarea {
        text-align: center;
        padding: 1rem;
        overflow: hidden;
    }
    .input-url,
    .input-title {
        width: 60rem;
    }
    .input-description,
    .input-hint {
        width: 60rem;
        height: 20rem;
    }
    /* .input-area {
        position: absolute;
    }
    .input-area.active {
        opacity: 1;
    }
    .input-area.inactive {
        top: -15rem;
        opacity: .5;
        filter: blur(2px);
        transform: scale(.8);
    }
    .input-area.disappear {
        top: -30rem;
        opacity: 0;
        filter: blur(4px);
        transform: scale(.5);
    }
    .input-area.waiting {
        opacity: 0;
    } */
</style>