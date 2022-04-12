<script>
    import { io }from 'socket.io-client'
    // const socket = io("https://garticsong.herokuapp.com/");
    const socket = io("http://10.30.5.129:2023");
    // const socket = io("http://192.168.219.101:2023");
    const configuration = {'iceServers': [
        {
            'urls':[
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
                "stun:stun.ekiga.net",
                "stun:stun.ideasip.com",
                "stun:stun.rixtelecom.se",
                "stun:stun.schlund.de",
                "stun:stun.stunprotocol.org:3478",
                "stun:stun.voiparound.com",
                "stun:stun.voipbuster.com",
                "stun:stun.voipstunt.com",
                "stun:stun.voxgratia.org",
                'turn:numb.viagenie.ca',
            ],
            username: 'webrtc@live.com',
            credential: 'muazkh',
        },
    ]};

    let isHost = false;

    function OnSubmitSignal(e) {

    }
</script>

<main>
    <input type="checkbox" name="is-host" id="is-host" on:change="{(e) => { isHost = e.target.checked }}">
    <label for="is-host">I am a host</label>
    <div class="result-box">
        <span class="result-text">

        </span>
    </div>
    <form on:submit|preventDefault={OnSubmitSignal}>
        <input type="text" name="data">
        <input type="submit" value="submit">
    </form>
</main>

<style>
    label {
        display: inline;
    }
    .result-box {
        min-width: 600px;
        width: 100%;
        height: 480px;
        border: 2px solid #fff;
        background-color: rgba(255, 255, 255, .23);
    }
    .result-text {

    }
</style>