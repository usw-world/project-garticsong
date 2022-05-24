<script>
    import { onMount } from "svelte";

    import LobbyGuide from "./LobbyGuide.svelte";
    import LobbyRelayer from "./LobbyRelayer.svelte";
    import UserInfo from "./UserInformation.svelte";

    export let props;
    let inviteLink = "https://garticsong.herokuapp.com/?jr=";
    let inviteLinkElmt;

    let users = [];

    onMount(() => {

    })
    function AddUser(_name/* string */, _profileImage/* number */) {
        let newUser = {
            name : _name,
            profileImage : _profileImage
        }
        users = [...users, newUser];
        console.log(users);
    }
    const OnCopyButton = () => {
        navigator.clipboard.writeText(inviteLink);
    }
    const SetInviteLink = (nextLink) => {
        inviteLink = `https://garticsong.herokuapp.com/?jr=${nextLink}`;
    }
</script>

<div class="lobby-wrap">
    <div class="lobby-top">
        <div class="invite-link">
            <span class="link" bind:this={inviteLinkElmt}>{inviteLink}</span>
            <button class="link-copy" on:click="{OnCopyButton}">copy</button>
        </div>
    </div>
    <div class="lobby-bottom">
        <div class="lobby-left">
            <UserInfo users={users}></UserInfo>
        </div>
        <div class="lobby-center">
            <LobbyGuide></LobbyGuide>
        </div>
        <div class="lobby-right">
            <div class="logo-area">
                <div class="logo-top">
                    <img src="/images/logo.svg" alt="">
                </div>
                <LobbyRelayer props={{
                    ...props,
                    SetInviteLink,
                    AddUser
                }}></LobbyRelayer>
            </div>
        </div>
    </div>
</div>

<style>
    .lobby-wrap {
        display: inline-block;
        max-width: 1200px;
        width: 100%;
        height: 70rem;
        margin: 0 auto;
    }
    .lobby-top {
        height: 8%;
        padding-left: 2rem;
        box-sizing: border-box;
    }
    .invite-link {
        font-size: 1.7rem;
        font-weight: 900;
        text-align: left;
        padding: .7rem 0;
    }
    .link-copy {
        margin-left: 1rem;
        font-size: 1.8rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -.1rem;
    }
    .lobby-bottom {
        display: flex;
        width: 100%;
        height: 92%;
        gap: 1rem;
    }
    .lobby-left {
        width: 22%;
        box-sizing: border-box;
        border: 5px solid transparent;
        background: linear-gradient(#151515, #151515),
        linear-gradient(-45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        border-radius: 0 0 0 10rem;
    }
    .lobby-center {
        width: 43%;
        height: 100%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-sizing: border-box;
        border: 5px solid transparent;
        border-radius: 0 0 10rem 0;
        overflow: hidden;
    }
    .lobby-right {
        width: calc(35% - 2rem);
    }
</style>