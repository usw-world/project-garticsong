<script>
    import { onMount } from "svelte";
    let nameBox;
    console.log(nameBox);

    onMount(async (event) => {
        console.log(nameBox);
    });
</script>

<main>
    <input class="box" bind:this="{nameBox}">
</main>

<style>
    .box {
        font-size: 50px;
    }
</style>