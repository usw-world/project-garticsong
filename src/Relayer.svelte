<script>
    import { io }from 'socket.io-client'
    // const socket = io("https://garticsong.herokuapp.com/");
    // const socket = io("http://10.30.5.129:2023");
    const socket = io("http://192.168.219.101:2023");
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
    let peerConnections = [];
    let signalChannels = [];

    async function OnSubmitSignal() {
        socket.on("link", async () => {
            const pc = new RTCPeerConnection(configuration);
            peerConnections.push(pc);
            pc.onicecandidate = (e) => {
                socket.emit("newIceCandidate", e.candidate);
            }

            let channel = await pc.createDataChannel("signal");
            channel.onopen = (e) => {
                console.log("Channel is Opened", e);
            }
            channel.onclose = (e) => {
                console.log("Channel is Closed", e);
            }
            signalChannels.push(channel)

            socket.on("answer", async (desc) => {
                pc.setRemoteDescription(desc);
                console.log("Receive Answer");
                socket.off("answer");
            })

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", offer)

            socket.on("newIceCandidate", e => {
                HandleNewCandidate(pc, e);
            });
        });
    }
    async function JoinRoom() {
        const pc = new RTCPeerConnection(configuration);
        pc.onicecandidate = (e) => {
            socket.emit("newIceCandidate", e.candidate);
        }
        socket.on("offer", async (desc) => {
            console.log("I receive offer");
            pc.setRemoteDescription(desc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answer", answer);
            socket.off("offer");
        })
        pc.ondatachannel = (e) => {
            const channel = e.channel;
            console.log("Data channel event on");
            channel.onmessage = (e) => {
                console.log("Received Message.", e.data);
            }
        }
        socket.emit("link");
        socket.on("newIceCandidate", e => {
            HandleNewCandidate(pc, e);
        });
    };

    function SendMessage(e) {
        signalChannels.forEach(channel => {
            channel.send(e.target.data.value);
        })
    }

    function HandleNewCandidate(pc, e) {
        pc.addIceCandidate(e)
        .then(
            () => {},
            (error) => { console.error(error); });
    }
</script>

<main>
    <input type="checkbox" name="is-host" id="is-host" on:change="{(e) => { isHost = e.target.checked }}">
    <label for="is-host">I am a host</label>
    <button on:click="{() => {
        if(isHost) OnSubmitSignal();
        else JoinRoom();
    }}">{#if isHost}HOST{:else}LINK{/if}</button>
    <div class="result-box">
        <span class="result-text">

        </span>
    </div>
    <form on:submit|preventDefault={SendMessage}>
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