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
    let peerConnections = [];
    let signalChannels = [];

    async function Listen() {
        socket.on("join-someone", async (userinfo) => {
            const pc = new RTCPeerConnection(configuration);
            pc.remoteSocketId = userinfo.sender;
            peerConnections.push(pc);
            pc.ondatachannel = OnMessage;
            pc.onicecandidate = OnIceCandidate;
            socket.on("newIceCandidate", (payload) => {
                HandleNewCandidate(pc, payload);
            });

            let channel = await pc.createDataChannel('signal');
            channel.onopen = (e) => { console.log("Channel is Opened", e); }
            channel.onclose = (e) => { console.log("Channel is Closed", e); }
            signalChannels.push(channel);

            socket.on("answer", async (desc) => {
                console.log(desc);
                await pc.setRemoteDescription(desc);
                // socket.off("answer");
            });

            const offer = await pc.createOffer();
            pc.setLocalDescription(offer);
            const payload = {
                offer : offer,
                sender: userinfo.sender
            }
            socket.emit("offer", payload);
        })
        socket.on("offer", async (payload) => {
            const pc = new RTCPeerConnection(configuration);
            pc.remoteSocketId = payload.reciever;
            peerConnections.push(pc);
            pc.ondatachannel = OnMessage;
            pc.onicecandidate = OnIceCandidate;
            socket.on("newIceCandidate", (payload) => {
                HandleNewCandidate(pc, payload);
            });
            console.log(payload)
            pc.setRemoteDescription(payload.offer);

            let channel = await pc.createDataChannel('signal');
            channel.onopen = (e) => { console.log("Channel is Opened", e); }
            channel.onclose = (e) => { console.log("Channel is Closed", e); }
            signalChannels.push(channel);

            const answer = await pc.createAnswer();
            pc.setLocalDescription(answer);
            socket.emit("answer", answer);
        })
        socket.emit("join-room");
    }

    function SendMessage(e) {
        console.log(signalChannels);
        signalChannels.forEach(channel => {
            channel.send(e.target.data.value);
        })
    }

    function HandleNewCandidate(pc, payload) {
        if(pc.remoteSocketId === payload.sender)
            pc.addIceCandidate(payload.candidate)
            .then(
                // () => { console.log("Never mind I'll find someone like you."); },
                // (error) => { console.error(error); }
            );
    }

    function OnMessage(e) {
        const channel = e.channel;
        channel.onmessage = (e) => {
            console.log("Received Message.", e.data);
        }
    }

    function OnIceCandidate(e) {
        if(e.candidate) socket.emit("newIceCandidate", e.candidate);
    }
</script>

<main>
    <input type="checkbox" name="is-host" id="is-host" on:change="{(e) => { isHost = e.target.checked }}">
    <label for="is-host">I am a host</label>
    <button on:click="{() => {
        if(isHost) Listen();
        else Listen();
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
        border: 2px solid #fff;
        background-color: rgba(255, 255, 255, .23);
    }
    .result-text {

    }
</style>