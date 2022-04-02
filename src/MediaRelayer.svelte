<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    const socket = io("https://garticsong.herokuapp.com/");
    // const socket = io("http://10.30.5.129:2023");
    // const socket = io("http://192.168.219.101:2023");
    const configuration = {'iceServers': [
        {
            'urls':['stun:stun.l.google.com:19302'/* , 'stun:stun1.l.google.com:19302' */]
        },
    ]};
    // const peerConnection = new RTCPeerConnection(configuration);
    let hostConnection;
    let guestConnection;
    // peerConnection.oniceconnectionstatechange = event => { console.log(peerConnection.iceConnectionState); };

    const GetUserMedia = async () => {
        try {
            const devices = await navigator.mediaDevices.getUserMedia({ "video": false, "audio": true });
            const stream = devices;
            const audioElmt = document.querySelector("audio#localaudio");
            audioElmt.srcObject = stream;
            stream.getTracks().forEach(track => {
                hostConnection.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error opening audio device.", error);
        }
    }
    let OnSubmitMessage = () => {
        const channel = hostConnection.createDataChannel("usoock");
        channel.onopen = (event) => {
            channel.send("Dragon Usoock!");
        };
        console.log("channel", channel);
        console.log("peerConnection", hostConnection);
    };
    
    const MakeCall = async () => {
        hostConnection = new RTCPeerConnection(configuration);

        const channel = hostConnection.createDataChannel("data channel");
        channel.onopen = (event) => {
            channel.send("Dragon Usoock!");
        };
        console.log("channel", channel);
        console.log("peerConnection", hostConnection);

        socket.on("answer", async payload => {
            // await peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
            await hostConnection.setRemoteDescription(payload);
            console.log("Receive answer.");
        });
        const offer = await hostConnection.createOffer();
        await hostConnection.setLocalDescription(offer);
        socket.emit("offer", {"offer": offer});
    }

    const MakeServe = async () => {
        guestConnection = new RTCPeerConnection(configuration);
        guestConnection.ondatachannel = (event) => {
            console.log("I can Fly!");
        }
        socket.on("offer", async payload => {
            guestConnection.setRemoteDescription(payload);
            // peerConnection.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await guestConnection.createAnswer();
            await guestConnection.setLocalDescription(answer);
            console.log("I receive offer");

            console.log(guestConnection);

            socket.emit("answer", answer);
        });
        guestConnection.addEventListener("track", async(event) => {
            const audioElmt = document.querySelector("audio#localaudio");
            const[ remoteStream ] = event.streams;
            audioElmt.srcObject = remoteStream;
        })

        console.log("Get ready to serve");
    };
    /* << Socket io test area */
</script>

<main>
    <div class="userinfo">
        <div class="userinfo-name"></div>
        <div class="userinfo-headers"></div>
        <div class="userinfo-body"></div>
        <button class="do-link" on:click="{MakeCall}">LINK</button>
    </div>
    <div class="serveman">
        <button class="do-serve" on:click="{MakeServe}">SERVE</button>
    </div>
    <button class="do-finddevice" on:click="{GetUserMedia}">MEDIA</button><br>
    <audio id="localaudio" autoplay playsinline controls="false" muted></audio><br>
    <form class="messagebox-wrap" on:submit|preventDefault="{OnSubmitMessage}">
        <textarea name="message" id="message" cols="30" rows="5"></textarea><br>
        <input type="submit" value="SEND" />
    </form>
</main>

<style>
    main {
        text-align: center;
    }
    textarea {
        resize: none;
    }
</style>