<script>
    import { onMount } from "svelte";
    import { socket as mainSocket } from "./store";
    import UserImageBox from './UserImageBox.svelte';
    let socket;
    let currentImageNumber = Math.floor(Math.random() * 6);
    let MAX_NUMBER = 5;

    new Audio("/soundEffects/door-bell.wav");
    new Audio("/soundEffects/guess.wav");
    new Audio("/soundEffects/hint.wav");
    new Audio("/soundEffects/result-screen.wav");
    new Audio("/soundEffects/start-question.wav");
    new Audio("/soundEffects/write-question.wav");

    const IncreaseNumber = () => {
        currentImageNumber = (currentImageNumber + 1) % (MAX_NUMBER+1)
    }
    const DicreaseNumber = () => {
        currentImageNumber = (currentImageNumber + MAX_NUMBER) % (MAX_NUMBER+1)
    }

    mainSocket.subscribe(value => { socket = value })
    export let props;

    let userinfomationForm;
    
    onMount(() => {
        document.querySelector(".input-username").focus();
        userinfomationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if(e.target["username"].value.trim() === "") {
                OnInputError();
                return;
            }

            props.SetPlayerInformation({
                id: socket.id,
                name: e.target["username"].value,
                profileImage: currentImageNumber,
            });
            props.SetGameState(1);
        })
    });
    const OnInputError = () => {
        document.querySelector(".input-username").style.animation = "inputError 400ms ease 1 forwards";
    }
    const OnClickInput = () => {
        document.querySelector(".input-username").style.animation = "none";
    }
</script>

<div class="wrap">
    <div class="intro-left">
        <div class="intro-logo">
            <div class="logo-top">
                <img src="/images/logo.svg" alt="">
            </div>
            <div class="logo-bottom">
                <img src="/images/main-character.svg" alt="">
            </div>
        </div>
    </div>
    <div class="intro-right">
        <form class="playerinfo-form outter-frame" bind:this="{userinfomationForm}">
                <div class="profile-image">
                    <div class="showing-image-frame">
                        <UserImageBox imageNumber={currentImageNumber} width={"100%"}; height={"100%"} />
                    </div>
                    <div class="arrows">
                        <span class="previous" on:click={DicreaseNumber}>
                            <img src="/images/prev-button.svg" alt="">
                        </span>
                        <span class="next" on:click={IncreaseNumber}>
                            <img src="/images/prev-button.svg" alt="">
                        </span>
                    </div>
                </div>
                <input type="text" name="username" placeholder="이름을 입력해주세요" class="input-username" on:click="{OnClickInput}">
                <button class="join-button">JOIN</button>
        </form>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    .wrap {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .intro-left {
        width: 100%;
        height: 100%;
    }
    .intro-logo {
        display: inline-block;
        width: 100%;
        padding: 0 3rem 0 13rem;
        max-width: 600px;
        box-sizing: border-box;
    }
    .logo-bottom {
        width: 100%;
    }
    .logo-bottom>img {
        width: 72%;
        margin-top: -1rem;
        margin-left: 2rem;
    }
    .profile-image {
        position: relative;
        width: 23rem;
        height: 23rem;
        border-radius: 50%;
        border: .8rem solid #fff;
    }
    .arrows {
        position: absolute;
        top: 0; left: 0;
        display: flex;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        justify-content: center;
        align-items: center;
    }
    .arrows>span {
        width: 3.4rem;
        pointer-events: initial;
        cursor: pointer;
        opacity: 0.88;
    }
    .arrows>span>img {
        width: 100%;
    }
    .arrows>span:hover {
        opacity: 1;
    }
    .arrows>.previous {
        position: absolute;
        left: -7.5rem;
    }
    .arrows>.next {
        position: absolute;
        right: -7.5rem;
        transform: rotate(180deg);
    }
    .intro-right {
        width: 100%;
        height: 100%;
    }
    .playerinfo-form {
        width: 90%;
        height: 55rem;
        margin: 0 auto;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        text-align: center;
        border-radius: 0 10rem 10rem 0;
        justify-content: center;
        align-items: center;
        gap: 1.2rem;
        /* border-radius: 5px;
        border: 1px solid black;
        box-shadow: 0 20px 20px rgba(0,0,0,0.3);
        border: solid 4px rgba(29,29,27,.15);  */
    }
    .showing-image-frame {
        position: relative;
        top: -25%;
        display: inline-flex;
        width: 100%;
        height: 125%;
        border-radius: 0 0 11.5rem 11.5rem;
        justify-content: center;
        align-items: flex-end;
        overflow: hidden;
    }
    .input-username {
        padding: 0 2rem;
        width: 30rem;
        height: 5.6rem;
        color: #2f2f2f;
        font-size: 2em;
        border-radius: 2.8rem;
        background-color: #fff;
        border: .3rem solid #787878;
    }
    .input-username::placeholder {
        color: #aaa;
    }
    .join-button {
        transition: background-color 100ms ease;
        width: 13rem;
        height: 6.2rem;
        padding-top: 0.2rem;
        color: #fff;
        font-size: 2.4em;
        font-weight: 900;
        text-transform: uppercase;
        border: .3rem solid #fff;
        border-radius: 3.1rem;
        box-sizing: border-box;
        background-color: #454545;
        vertical-align: middle;
        cursor: pointer;
    }
    .join-button:hover {
        background-color: #262626;
    }
    @media screen and (max-width: 1199px) 
    {
        .wrap {
            margin-top: -10rem;
            flex-direction: column;
        }
        .intro-logo {
            width: 100%;
            max-width: none;
            padding: 0 41rem 2rem 45rem;
            text-align: center;
            box-sizing: border-box;
        }
        .logo-bottom {
            display: none;
        }
        .playerinfo-form {
            max-width: none;
            width: 58%;
            height: 64rem;
            border-radius: 20rem 0rem 20rem 0rem;
        }
    }
</style>