<script>
    /* Socket io test area >> */
    import { io } from 'socket.io-client';

    // const socket = io("https://garticsong.herokuapp.com/");
    // const socket = io("http://10.30.5.129:2023");
    const socket = io("http://192.168.219.101:2023");
    const configuration = {'iceServers': [
        {
            'urls':['stun:stun.l.google.com:19302'/* , 'stun:stun1.l.google.com:19302' */]
        },
    ]};
    // const peerConnection = new RTCPeerConnection(configuration);
    let hostConnections = [];
    let hostConnection;
    let guestConnection;
    let dataChannel;
    // peerConnection.oniceconnectionstatechange = event => { console.log(peerConnection.iceConnectionState); };

    const GetUserMedia = async () => {
        // if(hostConnections.length > 0) {
        hostConnection = hostConnection || new RTCPeerConnection(configuration);
            // hostConnections.push(new RTCPeerConnection(configuration));
        // }
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
        dataChannel.send("usoock");
    };
    
    const MakeCall = async () => {
        hostConnection = hostConnection || new RTCPeerConnection(configuration);
        // hostConnections.push(new RTCPeerConnection(configuration));

        socket.on("newIceCandidate", (candidate) => {
            if(candidate) {
                hostConnection.addIceCandidate(candidate)
                .then(
                    () => { console.log("Success adding new ICE Candidate") },
                    (error) => { console.error(error) }
                );
            }
        })
        hostConnection.onicecandidate = e => {
            socket.emit("newIceCandidate", e.candidate);
        }

        dataChannel = hostConnection.createDataChannel("data channel");
        dataChannel.onopen = (e) => {
            console.log("Channel is Opened");
        };
        console.log("channel", dataChannel);
        console.log("peerConnection", hostConnection);

        socket.on("answer", async payload => {
            await hostConnection.setRemoteDescription(payload);
            console.log("Receive answer.");
        });
        const offer = await hostConnection.createOffer();
        await hostConnection.setLocalDescription(offer);
        socket.emit("offer", {"offer": offer});
    }

    const MakeServe = async () => {
        guestConnection = new RTCPeerConnection(configuration);
        guestConnection.onicecandidate = (e) => {
            socket.emit("newIceCandidate", e.candidate);
        }
        socket.on("newIceCandidate", candidate => {
            if(candidate) {
                guestConnection.addIceCandidate(candidate)
                .then(
                    () => { console.log("Success adding new ICE Candidate") },
                    (error) => { console.error(error) }
                );
            }
        })
        socket.on("offer", async payload => {
            guestConnection.setRemoteDescription(payload);
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
        });
        guestConnection.ondatachannel = (e) => {
            dataChannel = e.channel;
            dataChannel.onmessage = (e) => {
                console.log("Received Message");
                document.querySelector("#message").value = e.data;
            }
        };

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