<script>
    import UserInfoItem from './UserInformationItem.svelte';
    import { onMount } from 'svelte';

    const dummyUserData = [
        {
            name: "usoock",
            profileImage: 1,
        },
        {
            name: "west dragon pills",
            profileImage: 4,
        },
        {
            name: "double float",
            profileImage: 2,
        },
    ]
    let users = dummyUserData;

    function AddUser(_name/* string */, _profileImage/* number */) {
        let newUser = {
            name : _name,
            profileImage : _profileImage
        }
        users = [...users, newUser];
    }
</script>

<ul class="user-list">
    {#each users as user}
        <UserInfoItem info={user}></UserInfoItem>
    {/each}
</ul>

<style>
    .user-list {
        width: 100%;
        box-sizing: border-box;
        padding: .3rem .7rem;
    }
</style>