<script>
    export let imageNumber;
    export let width;
    export let height;
    imageNumber = imageNumber || 0;
</script>

<div class="image-wrap" style={`
    width: ${!!width ? width : "auto"};
    height: ${!!height ? height : "auto"};
`}>
    {#if imageNumber==0}
    <img src="../images/character-tambo.svg" alt="">
    {:else if imageNumber==1}
    <img src="../images/character-doggy.svg" alt="">
    {:else if imageNumber==2}
    <img src="../images/character-panda.svg" alt="">
    {:else if imageNumber==3}
    <img src="../images/character-pot.svg" alt="">
    {:else if imageNumber==4}
    <img src="../images/character-maracas.svg" alt="">
    {:else if imageNumber==5}
    <img src="../images/character-mic.svg" alt="">
    {/if}
</div>

<style>
    .image-wrap>img {
        width: 100%;
        height: 100%;
    }
</style>