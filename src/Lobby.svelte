<script>
    import { onMount } from "svelte";

    import LobbyGuide from "./LobbyGuide.svelte";
    import LobbyRelayer from "./LobbyRelayer.svelte";
    import UserInfo from "./UserInformation.svelte";
    import { game } from "./store";
    let thisGame;
    game.subscribe(game => { thisGame = game });

    export let props;
    let inviteLink = "https://garticsong.herokuapp.com/?jr=";

    function AddUser(_id/* string */, _name/* string */, _profileImage/* number */) {
        console.log(thisGame.room.users);
        let newUser = {
            id : _id,
            name : _name,
            profileImage : _profileImage
        }
        thisGame.room.users = [...thisGame.room.users, newUser];
    }
    function RemoveUser(targetId/* string */) {
        thisGame.room.users = thisGame.room.users.filter(user => {
            return user.id !== targetId;
        });
    }
    const OnCopyButton = () => {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(inviteLink);
        } else {
            let ta;
            try {
                ta = document.createElement("textarea")
                document.body.appendChild(ta);
                ta.value = inviteLink;
                ta.select();
                document.execCommand("copy");
            } catch {};
            document.body.removeChild(ta);
        }
    }
    const SetInviteLink = (nextLink) => {
        const url = new URL(window.location);
        console.log(url);
        inviteLink = `${url.href}?jr=${nextLink}`;
        // inviteLink = `https://garticsong.herokuapp.com/?jr=${nextLink}`;
    }
</script>

<div class="lobby-wrap">
    <div class="lobby-top">
        <div class="invite-link">
            <span class="link">{inviteLink}</span>
            <button class="link-copy" on:click="{OnCopyButton}">copy</button>
        </div>
    </div>
    <div class="lobby-bottom">
        <div class="lobby-left">
            <UserInfo users={thisGame.room.users}></UserInfo>
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
                    AddUser,
                    RemoveUser,
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
        overflow: hidden;
    }
    .lobby-center {
        width: 48%;
        height: 100%;
        background: linear-gradient(#151515, #151515),
        linear-gradient(45deg, var(--point-color-a), var(--point-color-b));
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-sizing: border-box;
        border: 5px solid transparent;
        border-radius: 0 10rem 0 0;
        overflow: hidden;
    }
    .lobby-right {
        width: calc(30% - 2rem);
    }
    .lobby-right .logo-top {
        padding: 5rem 3.5rem 3.5rem;
    }
</style>