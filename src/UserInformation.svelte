<script>
    import UserInfoItem from './UserInformationItem.svelte';
    import { onMount } from 'svelte';

    export let users;
</script>

<div class="box-wrapper">
    <ul class="user-list">
        {#each users as user}
            <UserInfoItem info={user}></UserInfoItem>
        {/each}
    </ul>
</div>

<style>
    .box-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .user-list {
        width: 100%;
        box-sizing: border-box;
        padding: .3rem .7rem;
    }
</style>